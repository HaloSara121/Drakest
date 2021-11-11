import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";


class SocketService {
  public socket: Socket | null = null

  public async connect(url: string): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
    return new Promise((rs, rj) => {
      this.socket = io(url)
      
      if(!this.socket) return rj()

      this.socket.on("connect", () => {
        rs(this.socket as Socket)
      })

      this.socket.on("connect_error", (err: any) => {
        console.log('Connection Error: ', err)
        rj(err)
      })
    })
  }
}

export default new SocketService()