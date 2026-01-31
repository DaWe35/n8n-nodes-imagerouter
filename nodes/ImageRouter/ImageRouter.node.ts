import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeConnectionType,
	IHttpRequestOptions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';

export class ImageRouter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ImageRouter',
		name: 'imageRouter',
		icon: 'file:imagerouter-white-transparent.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter.operation + ": " + $parameter.resource }}',
		description: 'Generate AI images and videos through ImageRouter.io',
		defaults: {
			name: 'Image Router',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'imageRouterApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Video',
						value: 'video',
					},
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
						name: 'Models',
						value: 'models',
					},
				],
				default: 'image',
				noDataExpression: true,
			},
			// Operation for Image resource
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['image'],
					},
				},
				options: [
					{
						name: 'Text to Image',
						value: 'textToImage',
						action: 'Text to image',
					},
					{
						name: 'Image to Image',
						value: 'imageToImage',
						action: 'Image to image',
					},
				],
				default: 'textToImage',
				noDataExpression: true,
			},

			// Operation for Video resource
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['video'],
					},
				},
				options: [
					{
						name: 'Text to Video',
						value: 'textToVideo',
						action: 'Text to video',
					},
					{
						name: 'Image to Video',
						value: 'imageToVideo',
						action: 'Image to video',
					},
				],
				default: 'textToVideo',
				noDataExpression: true,
			},

			// Operation for Models resource
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['models'],
					},
				},
				options: [
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-option-name-wrong-for-get-many
						name: 'Get All Models',
						value: 'getAll',
						// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-wrong-for-get-many
						action: 'Get all models',
					},
				],
				default: 'getAll',
				noDataExpression: true,
			},
		{
			displayName: 'Model',
			name: 'model',
			type: 'string',
			required: true,
			default: 'test/test',
			displayOptions: {
				show: {
					resource: ['image'],
				},
			},
		},
		{
			displayName: 'Model',
			name: 'model',
			type: 'string',
			required: true,
			default: 'ir/test-video',
			displayOptions: {
				show: {
					resource: ['video'],
				},
			},
		},
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['image', 'video'],
					},
				},
			},
			{
				displayName: 'Image',
				name: 'binaryProperty',
				type: 'string',
				default: '',
				description:
					'Optional binary property that contains an image to edit. Leave empty to generate image from text only.',
				displayOptions: {
					show: {
						operation: ['imageToImage', 'imageToVideo'],
					},
				},
			},
			{
				displayName: 'Image Mask',
				name: 'maskBinaryProperty',
				type: 'string',
				default: '',
				description: 'Optional mask image binary property (only a few models require it)',
				displayOptions: {
					show: {
						operation: ['imageToImage'],
					},
				},
			},
			{
				displayName: 'Quality',
				name: 'quality',
				type: 'options',
				options: [
					{ name: 'auto', value: 'auto' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
					{ name: 'low', value: 'low' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
					{ name: 'medium', value: 'medium' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
					{ name: 'high', value: 'high' }, // eslint-disable-line n8n-nodes-base/node-param-display-name-miscased
				],
				default: 'auto',
				description: 'Generation quality (if supported by the model)',
				displayOptions: {
					show: {
						resource: ['image', 'video'],
					},
				},
			},
			{
				displayName: 'Size',
				name: 'size',
				type: 'string',
				default: 'auto',
				description: '"auto" or "WIDTHxHEIGHT" (e.g. "1024x1024") depending on model',
				displayOptions: {
					show: {
						resource: ['image', 'video'],
					},
				},
			},
			{
				displayName: 'Response Format',
				name: 'response_format',
				type: 'options',
				options: [
					{ name: 'URL', value: 'url' },
					{ name: 'Base64 JSON', value: 'b64_json' },
					{ name: 'Base64 Ephemeral', value: 'b64_ephemeral' },
				],
				default: 'url',
				displayOptions: {
					show: {
						resource: ['image', 'video'],
					},
				},
			},
			{
				displayName: 'Output Format',
				name: 'output_format',
				type: 'options',
				options: [
					{ name: 'PNG', value: 'png' },
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'WEBP', value: 'webp' },
				],
				default: 'webp',
				description: 'Output image format',
				displayOptions: {
					show: {
						resource: ['image'],
					},
				},
			},
			{
				displayName: 'Seconds',
				name: 'seconds',
				type: 'string',
				default: 'auto',
				description: 'Duration of the video in seconds or "auto"',
				displayOptions: {
					show: {
						resource: ['video'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const baseURL = 'https://api.imagerouter.io/v1';

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;

			let endpoint = '';
			let options: IHttpRequestOptions = {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
				url: '',
			};

			if (resource === 'models') {
				endpoint = '/models';
				options.method = 'GET';
				options.json = true;
			} else if (resource === 'image' || resource === 'video') {
				options.method = 'POST';
				const prompt = this.getNodeParameter('prompt', i) as string;
				const model = this.getNodeParameter('model', i) as string;
				const quality = this.getNodeParameter('quality', i) as string;
				const size = this.getNodeParameter('size', i) as string;
				const response_format = this.getNodeParameter('response_format', i) as string;
				const output_format = this.getNodeParameter('output_format', i, '') as string;
				const seconds = this.getNodeParameter('seconds', i, 'auto') as string;

				const binaryProperty = this.getNodeParameter('binaryProperty', i, '') as string;
				const maskBinaryProperty = this.getNodeParameter('maskBinaryProperty', i, '') as string;

				if (resource === 'image') {
					endpoint = '/openai/images/edits';
				} else if (resource === 'video') {
					endpoint = '/openai/videos/generations';
				}
				const formData = new FormData();
				formData.append('prompt', prompt);
				formData.append('model', model);
				if (resource === 'image' && quality) {
					formData.append('quality', quality);
				}
				if (size) {
					formData.append('size', size);
				}
				if (response_format) {
					formData.append('response_format', response_format);
				}
				if (resource === 'image' && output_format) {
					formData.append('output_format', output_format);
				}
				if (resource === 'video' && seconds) {
					formData.append('seconds', String(seconds));
				}

				if (binaryProperty) {
					const binaryData = items[i].binary?.[binaryProperty];
					if (!binaryData) {
						throw new NodeOperationError(
							this.getNode(),
							`Binary property "${binaryProperty}" not found on input item`,
						);
					}
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
					if (!buffer) {
						throw new NodeOperationError(
							this.getNode(),
							`Binary property "${binaryProperty}" not found on input item`,
						);
					}
					const imageBlob = new Blob([new Uint8Array(buffer)], {
						type: binaryData.mimeType || 'application/octet-stream',
					});
					formData.append('image[]', imageBlob, binaryData.fileName || 'image');

					if (resource === 'image' && maskBinaryProperty) {
						const maskData = items[i].binary?.[maskBinaryProperty];
						if (!maskData) {
							throw new NodeOperationError(
								this.getNode(),
								`Mask binary property "${maskBinaryProperty}" not found`,
							);
						}
						const maskBuf = await this.helpers.getBinaryDataBuffer(i, maskBinaryProperty);
						if (!maskBuf) {
							throw new NodeOperationError(
								this.getNode(),
								`Mask binary property "${maskBinaryProperty}" not found`,
							);
						}
						const maskBlob = new Blob([new Uint8Array(maskBuf)], {
							type: maskData.mimeType || 'application/octet-stream',
						});
						formData.append('mask[]', maskBlob, maskData.fileName || 'mask');
					}
				}

				options.body = formData;

			}

			options.url = `${baseURL}${endpoint}`;

			const responseData = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'imageRouterApi',
				options,
			);

			returnData.push(responseData as IDataObject);
		}

		const executionData: INodeExecutionData[] = returnData.map((d) => ({ json: d }));
		return [executionData];
	}
}
