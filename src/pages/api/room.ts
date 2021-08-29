import { query as q } from "faunadb"
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { fauna } from "../../services/fauna"
import { generateRoomId } from "../../utils/generateRandomRoomId";

type User = {
  data: {
    email: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET'){
    
    const { roomId } = req.query

    const currentRoomIdExists = await fauna.query(
      q.Exists(
        q.Match(
          q.Index('room_by_id'),
          roomId
        )
      )
    )

    if(currentRoomIdExists){
      return res.status(200).json({roomId})
    }
    
    return res.status(404).json({error: "Room id not found"})
  }

  if (req.method === 'POST'){
    const session = await getSession({req})
    
    const roomId = generateRoomId()

    if(!session){
      return res.status(404).json({error: "user not found"})
    }

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    await fauna.query(
      q.If(
        q.Not(
          q.Exists(
            q.Match(
              q.Index('room_by_id'),
              q.Casefold(roomId)
            )
          )
        ),
        q.Create(
          q.Collection('rooms'),
          {data: {id: roomId, room_owner: user.data.email}}
        ),
        q.Get(
          q.Match(
            q.Index('room_by_id'), 
            q.Casefold(roomId)
          )
        )
      )
    )

    return res.status(202).json({roomId})
  }
}