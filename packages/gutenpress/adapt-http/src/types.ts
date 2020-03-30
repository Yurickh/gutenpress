import * as http from 'http'
import { Resource } from '@gutenpress/core'

export type EmptyObject = { [key: string]: never }

export type ContextFrom<R> = R extends Resource<any, infer Context>
  ? Context
  : never

export type InitialContextBuilder<InitialContext> = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => InitialContext

export interface AdaptHTTPConfig<InitialContext> {
  initialContextBuilder: InitialContextBuilder<InitialContext>
}
