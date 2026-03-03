import { render, screen, fireEvent, cleanup } from "@testing-library/vue"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import AdminPage from "../../components/admin/AdminPage.vue"

const authWithPassword = vi.hoisted(function () {
  return vi.fn()
})
const getPocketBaseClient = vi.hoisted(function () {
  return vi.fn()
})

vi.mock("../../lib/pocketbase/client", function () {
  return {
    getPocketBaseClient: getPocketBaseClient
  }
})

describe("AdminPage", function () {
  beforeEach(function () {
    authWithPassword.mockReset()
    getPocketBaseClient.mockReset()
    getPocketBaseClient.mockReturnValue({
      collection: function () {
        return {
          authWithPassword: authWithPassword
        }
      }
    })
  })

  afterEach(function () {
    cleanup()
  })

  it("shows error when login fails", async function () {
    authWithPassword.mockRejectedValue(new Error("登入失敗"))

    render(AdminPage, {
      global: {
        stubs: {
          ContentEditor: {
            template: "<div>ContentEditorStub</div>"
          }
        }
      }
    })

    const emailInput = await screen.findByLabelText("Email")
    const passwordInput = await screen.findByLabelText("密碼")

    await fireEvent.update(emailInput, "test@example.com")
    await fireEvent.update(passwordInput, "password")
    await fireEvent.click(screen.getByText("登入"))

    expect(await screen.findByText("登入失敗")).toBeTruthy()
  })

  it("shows editor when login succeeds", async function () {
    authWithPassword.mockResolvedValue({})

    render(AdminPage, {
      global: {
        stubs: {
          ContentEditor: {
            template: "<div>ContentEditorStub</div>"
          }
        }
      }
    })

    const emailInput = await screen.findByLabelText("Email")
    const passwordInput = await screen.findByLabelText("密碼")

    await fireEvent.update(emailInput, "test@example.com")
    await fireEvent.update(passwordInput, "password")
    await fireEvent.click(screen.getByText("登入"))

    expect(await screen.findByText("ContentEditorStub")).toBeTruthy()
  })
})
