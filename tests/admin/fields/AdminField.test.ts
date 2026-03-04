import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import AdminField from "../../../components/admin/fields/AdminField.vue"

describe("AdminField", function () {
  it("renders text input with label", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: "hello", label: "名稱" }
    })
    expect(wrapper.find("label").text()).toBe("名稱")
    expect(wrapper.find("input").element.value).toBe("hello")
  })

  it("renders textarea when type is textarea", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: "content", label: "描述", type: "textarea", rows: 4 }
    })
    expect(wrapper.find("textarea").exists()).toBe(true)
    expect(wrapper.find("textarea").element.value).toBe("content")
    expect(wrapper.find("textarea").attributes("rows")).toBe("4")
  })

  it("renders number input", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: 48, label: "高度", type: "number" }
    })
    const input = wrapper.find("input")
    expect(input.attributes("type")).toBe("number")
  })

  it("renders checkbox", function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: true, label: "主要", type: "checkbox" }
    })
    const input = wrapper.find("input[type='checkbox']")
    expect(input.exists()).toBe(true)
    expect(input.element.checked).toBe(true)
  })

  it("emits update on text input", async function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: "", label: "名稱" }
    })
    await wrapper.find("input").setValue("new value")
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe("new value")
  })

  it("emits update on checkbox change", async function () {
    const wrapper = mount(AdminField, {
      props: { modelValue: false, label: "主要", type: "checkbox" }
    })
    await wrapper.find("input[type='checkbox']").setValue(true)
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe(true)
  })
})
