import * as http from 'http'

export type EmptyObject = { [key: string]: never }

export type InitialContextBuilder<InitialContext> = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => InitialContext

export interface AdaptHTTPConfig<InitialContext> {
  initialContextBuilder: InitialContextBuilder<InitialContext>
}
