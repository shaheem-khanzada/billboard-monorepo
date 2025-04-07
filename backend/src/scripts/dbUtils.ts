import DbService from "./dbService"

const network = 'localhost';

// helper function to get last block processed for an specific event
export const getEventLastBlock = async ({ query, collectionName }: any) => {
  if (!collectionName) collectionName = 'events'

  const db = await DbService.getDb()
  const coll = db.collection(collectionName)
  const cursor = await coll.findOne(
    {
      query,
      network
    },
    { projection: { _id: 0 } }
  )

  return cursor
}

export const saveEventLastBlock = async ({ query, collectionName, lastBlock }: any) => {
  if (!collectionName) collectionName = 'events'

  const db = await DbService.getDb()
  const coll = db.collection(collectionName)
  const result = await coll.updateOne(
    {
      query,
      network
    },
    { $set: { lastBlock: lastBlock } },
    { upsert: true }
  )

  return result
}
