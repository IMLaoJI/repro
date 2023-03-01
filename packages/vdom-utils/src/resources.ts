import {
  InteractionType,
  PatchType,
  SourceEvent,
  SourceEventType,
} from '@repro/domain'
import { randomString } from '@repro/random-string'
import { createVTreeWalker } from './createVTreeWalker'
import { isElementVNode } from './matchers'

export function createResourceMap(events: Array<SourceEvent>) {
  const visitedURLs = new Set<string>()
  const resourceMap: Record<string, string> = {}
  const walkVTree = createVTreeWalker()

  let currentPageURL = ''

  function addResource(url: string) {
    const absoluteURL = new URL(url, currentPageURL).href

    if (!visitedURLs.has(absoluteURL)) {
      const resourceId = randomString(4)
      resourceMap[resourceId] = absoluteURL
      visitedURLs.add(absoluteURL)
    }
  }

  function parseSrcset(srcset: string) {
    const urls: Array<string> = []

    for (let part of srcset.split(',')) {
      part = part.trim()
      const [url] = part.split(/\s+/) as [string]
      urls.push(url)
    }

    return urls
  }

  walkVTree.accept({
    elementNode(node, vtree) {
      if (node.tagName !== 'img' && node.tagName !== 'source') {
        return
      }

      if (node.tagName === 'source') {
        const parent = node.parentId ? vtree.nodes[node.parentId] : null
        const isPictureSource =
          parent && isElementVNode(parent) && parent.tagName === 'picture'

        if (!isPictureSource) {
          return
        }
      }

      if (node.attributes.src) {
        addResource(node.attributes.src)
      }

      if (node.attributes.srcset) {
        const urls = parseSrcset(node.attributes.srcset)

        for (const url of urls) {
          addResource(url)
        }
      }
    },

    // Not implemented
    documentNode() {},
    docTypeNode() {},
    textNode() {},
  })

  // Get initial page URL
  // TODO: this should be on the leading snapshot
  for (const event of events) {
    if (event.type === SourceEventType.Interaction) {
      if (event.data.type === InteractionType.PageTransition) {
        currentPageURL = event.data.to
        break
      }
    }
  }

  const firstEvent = events[0]

  // Walk leading snapshot
  if (firstEvent && firstEvent.type === SourceEventType.Snapshot) {
    if (firstEvent.data.dom) {
      walkVTree(firstEvent.data.dom)
    }
  }

  for (const event of events) {
    if (event.type === SourceEventType.Interaction) {
      if (event.data.type === InteractionType.PageTransition) {
        currentPageURL = event.data.to
      }
    }

    if (event.type === SourceEventType.DOMPatch) {
      if (event.data.type === PatchType.Attribute) {
        const attributeName = event.data.name
        const attributeValue = event.data.value

        if (attributeValue !== null) {
          if (attributeName === 'src') {
            addResource(attributeValue)
          }

          if (attributeName === 'srcset') {
            const urls = parseSrcset(attributeValue)

            for (const url of urls) {
              addResource(url)
            }
          }
        }
      }
    }
  }

  return resourceMap
}
