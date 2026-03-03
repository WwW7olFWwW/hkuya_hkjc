import { describe, it, expect } from "vitest"
import { resolvePublicPocketBaseUrl } from "../../lib/pocketbase/publicUrl"

describe("resolvePublicPocketBaseUrl", function () {
  it("uses /pb when env url is empty", function () {
    expect(resolvePublicPocketBaseUrl("production", "")).toBe("/pb")
  })

  it("uses /pb in production when env url is localhost", function () {
    expect(resolvePublicPocketBaseUrl("production", "http://127.0.0.1:8090")).toBe("/pb")
    expect(resolvePublicPocketBaseUrl("production", "http://localhost:8090")).toBe("/pb")
    expect(resolvePublicPocketBaseUrl("production", "http://0.0.0.0:8090")).toBe("/pb")
  })

  it("keeps non-local url in production", function () {
    expect(resolvePublicPocketBaseUrl("production", "https://pb.example.com")).toBe("https://pb.example.com")
  })

  it("keeps localhost in development", function () {
    expect(resolvePublicPocketBaseUrl("development", "http://127.0.0.1:8090")).toBe("http://127.0.0.1:8090")
  })
})
