export function toCategoryDTO(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}
