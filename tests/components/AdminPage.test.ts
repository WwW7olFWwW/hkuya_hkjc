import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import AdminPage from "../../components/admin/AdminPage.vue"

const signInWithPassword = vi.hoisted(function () {
  return vi.fn()
})
const getSupabaseClient = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/supabase/client", function () {
  return {
    getSupabaseClient: getSupabaseClient
  }
})

describe("AdminPage", function () {
  beforeEach(function () {
    signInWithPassword.mockReset()
    getSupabaseClient.mockReset()
    getSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: signInWithPassword
      }
    })
  })

  afterEach(function () {
    cleanup()
  })

  it("shows error when login fails", async function () {
    signInWithPassword.mockResolvedValue({ error: { message: "登入失敗" } })

    render(AdminPage, {
      global: {
        stubs: {
          ContentEditor: {
            template: "<div>ContentEditorStub</div>"
          }
        }
      }
    })

    await fireEvent.update(screen.getByLabelText("Email"), "test@example.com")
    await fireEvent.update(screen.getByLabelText("密碼"), "password")
    await fireEvent.click(screen.getByText("登入"))

    expect(await screen.findByText("登入失敗")).toBeTruthy()
  })

  it("shows editor when login succeeds", async function () {
    signInWithPassword.mockResolvedValue({ error: null })

    render(AdminPage, {
      global: {
        stubs: {
          ContentEditor: {
            template: "<div>ContentEditorStub</div>"
          }
        }
      }
    })

    await fireEvent.update(screen.getByLabelText("Email"), "test@example.com")
    await fireEvent.update(screen.getByLabelText("密碼"), "password")
    await fireEvent.click(screen.getByText("登入"))

    expect(await screen.findByText("ContentEditorStub")).toBeTruthy()
  })
})
