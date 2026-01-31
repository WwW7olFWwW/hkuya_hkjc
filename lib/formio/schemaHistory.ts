export type HistoryRow = {
  id?: number
  slug: string
  created_at: string
}

export function sortHistoryDesc(items: HistoryRow[]) {
  const sorted = items.slice()
  sorted.sort(function (a, b) {
    if (a.created_at === b.created_at) {
      return 0
    }
    return a.created_at < b.created_at ? 1 : -1
  })
  return sorted
}

export function trimHistoryForSlug(items: HistoryRow[], slug: string, keep: number) {
  const filtered: HistoryRow[] = []
  for (const item of items) {
    if (item.slug === slug) {
      filtered.push(item)
    }
  }
  const sorted = sortHistoryDesc(filtered)
  return sorted.slice(0, keep)
}

export function pickHistoryIdsToDelete(items: HistoryRow[], slug: string, keep: number) {
  const keepItems = trimHistoryForSlug(items, slug, keep)
  const keepIds = new Set<number>()

  for (const item of keepItems) {
    if (typeof item.id === "number") {
      keepIds.add(item.id)
    }
  }

  const deleteIds: number[] = []
  for (const item of items) {
    if (item.slug !== slug) {
      continue
    }
    if (typeof item.id !== "number") {
      continue
    }
    if (!keepIds.has(item.id)) {
      deleteIds.push(item.id)
    }
  }
  return deleteIds
}
