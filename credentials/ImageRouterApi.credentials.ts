import { IAuthenticateGeneric, ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class ImageRouterApi implements ICredentialType {
	name = 'imageRouterApi';
	displayName = 'ImageRouter API';
	// Uses the link to this tutorial as an example
	// Replace with your own docs links when building your own nodes
	documentationUrl = 'https://docs.imagerouter.io/api-reference/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
	];

	// Verify that the provided API key is valid by hitting the test endpoint
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.imagerouter.io',
			url: '/v1/auth/test',
			method: 'POST',
		},
	};
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
