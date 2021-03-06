import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query as q } from 'faunadb'

import { fauna } from '../../../services/fauna'
import { v4 } from 'uuid'

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_CLIENT_KEY,
    })
  ],

  callbacks: {
    async signIn(user, account, profile){
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              {data: {
                id: v4(),
                ...user
              }}
            ),
            q.Get(
              q.Match(
                  q.Index('user_by_email'), 
                  q.Casefold(user.email)
              )
            )
          )
        )

        return true
      } catch {
        return false
      }
    },

    // async jwt(token, user, account, profile, isNewUser) {
    //   if (account?.accessToken) {
    //     token.accessToken = account.accessToken;
    //   }
      
    //   return token;
    // },
  }
})
