export default arrayOfObjectsWithId => {
  if (
    typeof arrayOfObjectsWithId !== 'object' ||
    !arrayOfObjectsWithId.length
  ) {
    throw new Error(`It can only normalize arrays.`)
  }

  let byId = {}
  let ids = []

  for (let { id, ...otherProps } of arrayOfObjectsWithId) {
    byId[id] = otherProps
    ids.push(id)
  }

  return { byId, ids }
}
