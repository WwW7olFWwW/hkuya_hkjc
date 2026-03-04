import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import AdminRepeater from "../../../components/admin/fields/AdminRepeater.vue"

describe("AdminRepeater", function () {
  it("renders items from modelValue", function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }, { name: "b" }],
        emptyItem: { name: "" }
      },
      slots: {
        item: '<div class="test-item">item</div>'
      }
    })
    expect(wrapper.findAll(".test-item").length).toBe(2)
  })

  it("adds new item on add button click", async function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }],
        emptyItem: { name: "" }
      },
      slots: {
        item: '<div class="test-item">item</div>'
      }
    })
    await wrapper.find("[data-test='add-btn']").trigger("click")
    const emitted = wrapper.emitted("update:modelValue")
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveLength(2)
    expect(emitted[0][0][1]).toEqual({ name: "" })
  })

  it("removes item on remove button click", async function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }, { name: "b" }],
        emptyItem: { name: "" }
      },
      slots: {
        item: '<div class="test-item">item</div>'
      }
    })
    const removeBtns = wrapper.findAll("[data-test='remove-btn']")
    await removeBtns[0].trigger("click")
    const emitted = wrapper.emitted("update:modelValue")
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveLength(1)
    expect(emitted[0][0][0]).toEqual({ name: "b" })
  })

  it("respects min prop and disables remove", function () {
    const wrapper = mount(AdminRepeater, {
      props: {
        modelValue: [{ name: "a" }],
        emptyItem: { name: "" },
        min: 1
      },
      slots: {
        item: '<div class="test-item">item</div>'
      }
    })
    const removeBtn = wrapper.find("[data-test='remove-btn']")
    expect(removeBtn.attributes("disabled")).toBeDefined()
  })
})
