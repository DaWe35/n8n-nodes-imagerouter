import { IExecuteFunctions, INodeExecutionData, NodeConnectionType, IHttpRequestOptions } from 'n8n-workflow'
import {
 INodeType,
 INodeTypeDescription,
 IDataObject,
 NodeOperationError,
} from 'n8n-workflow'
import FormData from 'form-data'
import { Buffer } from 'buffer'

export class ImageRouter implements INodeType {
 description: INodeTypeDescription = {
  displayName: 'ImageRouter',
  name: 'imageRouter',
  icon: 'file:imagerouter.svg',
  group: ['transform'],
  version: 1,
  subtitle: '={{ $parameter.operation + ": " + $parameter.resource }}',
  description: 'Generate images or videos through ImageRouter',
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
    ],
    default: 'image',
    noDataExpression: true,
   },
   {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    options: [
     {
      name: 'Generate',
      value: 'generate',
      action: 'Generate',
     },
    ],
    default: 'generate',
    noDataExpression: true,
   },
   {
    displayName: 'Prompt',
    name: 'prompt',
    type: 'string',
    required: true,
    default: '',
   },
   {
    displayName: 'Model',
    name: 'model',
    type: 'string',
    required: true,
    default: 'test/test',
   },
   {
    displayName: 'Binary Property (Image)',
    name: 'binaryProperty',
    type: 'string',
    default: '',
    description: 'Name of binary property that contains an image to edit. Leave empty to generate from prompt.',
    displayOptions: {
     show: {
      resource: ['image', 'video'],
     },
    },
   },
   {
    displayName: 'Mask Binary Property',
    name: 'maskBinaryProperty',
    type: 'string',
    default: '',
    description: 'Optional mask image binary property (some models require it)',
    displayOptions: {
     show: {
      resource: ['image'],
     },
    },
   },
   {
    displayName: 'Quality',
    name: 'quality',
    type: 'options',
    options: [
     { name: 'Auto', value: 'auto' },
     { name: 'Low', value: 'low' },
     { name: 'Medium', value: 'medium' },
     { name: 'High', value: 'high' },
    ],
    default: 'auto',
    description: 'Generation quality (if supported by the model)',
   },
   {
    displayName: 'Size',
    name: 'size',
    type: 'string',
    default: 'auto',
    description: 'auto or WIDTHxHEIGHT (e.g. 1024x1024) depending on model',
   },
   {
    displayName: 'Response Format',
    name: 'response_format',
    type: 'options',
    options: [
     { name: 'URL', value: 'url' },
     { name: 'Base64 JSON', value: 'b64_json' },
    ],
    default: 'url',
   },
  ],
 }

 async execute(this: IExecuteFunctions) {
  const items = this.getInputData()
  const returnData: IDataObject[] = []
  const baseURL = 'https://api.imagerouter.io/v1/openai'

  for (let i = 0; i < items.length; i++) {
   const resource = this.getNodeParameter('resource', i) as string
   const prompt = this.getNodeParameter('prompt', i) as string
   const model = this.getNodeParameter('model', i) as string
   const quality = this.getNodeParameter('quality', i) as string
   const size = this.getNodeParameter('size', i) as string
   const response_format = this.getNodeParameter('response_format', i) as string

   const binaryProperty = this.getNodeParameter('binaryProperty', i, '') as string
   const maskBinaryProperty = this.getNodeParameter('maskBinaryProperty', i, '') as string

   let endpoint = ''
   let options: IHttpRequestOptions = {
    method: 'POST',
    headers: {
     Accept: 'application/json',
    },
    url: '',
   }

   if (resource === 'image' || resource === 'video') {
    if (binaryProperty) {
     endpoint = resource === 'image' ? '/images/generations' : '/videos/generations'
     const form = new FormData()
     form.append('prompt', prompt)
     form.append('model', model)
     // quality applies only for images
     if (resource === 'image' && quality) form.append('quality', quality)
     if (size) form.append('size', size)
     if (response_format) form.append('response_format', response_format)

     const binaryData = items[i].binary?.[binaryProperty]
     if (!binaryData) {
      throw new NodeOperationError(this.getNode(), `Binary property "${binaryProperty}" not found on input item`)
     }
     const buffer = Buffer.from(binaryData.data, (binaryData.encoding as string) || 'base64')
     form.append('image[]', buffer, {
      filename: binaryData.fileName || 'image',
      contentType: binaryData.mimeType || 'application/octet-stream',
     })

     // mask applies only for images
     if (resource === 'image' && maskBinaryProperty) {
      const maskData = items[i].binary?.[maskBinaryProperty]
      if (!maskData) {
       throw new NodeOperationError(this.getNode(), `Mask binary property "${maskBinaryProperty}" not found`)
      }
      const maskBuf = Buffer.from(maskData.data, (maskData.encoding as string) || 'base64')
      form.append('mask[]', maskBuf, {
       filename: maskData.fileName || 'mask',
       contentType: maskData.mimeType || 'application/octet-stream',
      })
     }

     options.body = form
     // @ts-ignore
     options.headers = { ...options.headers, ...form.getHeaders() }
    } else {
     endpoint = resource === 'image' ? '/images/generations' : '/videos/generations'
     options.body = {
      prompt,
      model,
      ...(resource === 'image' ? { quality } : {}),
      size,
      response_format,
     }
     options.json = true
    }
   }

   options.url = `${baseURL}${endpoint}`

   const responseData = await this.helpers.httpRequestWithAuthentication.call(
    this,
    'imageRouterApi',
    options,
   )

   returnData.push(responseData as IDataObject)
  }

  const executionData: INodeExecutionData[] = returnData.map((d) => ({ json: d }))
  return [executionData]
 }
}