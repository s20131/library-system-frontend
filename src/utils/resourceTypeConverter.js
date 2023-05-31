const getResourceType = (resourceType) => {
  return resourceType.toLowerCase() + 's'  // books, ebooks
};

export default getResourceType;