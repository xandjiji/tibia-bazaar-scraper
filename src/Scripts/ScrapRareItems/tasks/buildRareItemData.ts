export const buildRareItemData = (
  completeCollection: RareItemBlockCollection,
): RareItemData => {
  const rareItemData: RareItemData = {}
  Object.values(completeCollection).forEach(({ name, ids }) => {
    if (ids.length > 0) {
      rareItemData[name] = ids
    }
  })
  return rareItemData
}
