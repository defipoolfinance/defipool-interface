// Adds global types for functions/
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../index.d.ts" />

/* eslint-disable import/no-unused-modules */
import { paths } from '../src/pages/paths'
import { MetaTagInjector } from './components/metaTagInjector'

function doesMatchPath(path: string): boolean {
  const regexPaths = paths.map((p) => '^' + p.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*') + '$')

  return regexPaths.some((regex) => new RegExp(regex).test(path))
}

export const onRequest: PagesFunction = async ({ request, next }) => {
  const requestURL = new URL(request.url)
  const imageUri = requestURL.origin + '/images/1200x630_Rich_Link_Preview_Image.png'
  const data = {
    title: 'DeFi Pool',
    image: imageUri,
    url: request.url,
    description: 'Swap or provide liquidity on the DeFi Pool Protocol',
  }
  const res = next()
  try {
    const content = new HTMLRewriter().on('head', new MetaTagInjector(data, request)).transform(await res).body
    return new Response(content, {
      status: doesMatchPath(requestURL.pathname) || requestURL.pathname.includes('.') ? 200 : 404,
    })
  } catch (e) {
    return res
  }
}
