export const toApi = data => ( {
	name: data.name,
	description: data.description,
	// @todo - sluggify name
	slug: data.name,
} );
