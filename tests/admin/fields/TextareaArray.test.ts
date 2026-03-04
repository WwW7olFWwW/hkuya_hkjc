import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import TextareaArray from "../../../components/admin/fields/TextareaArray.vue"

describe("TextareaArray", function () {
  it("renders string array as newline-separated text", function () {
    const wrapper = mount(TextareaArray, {
      props: {
        modelValue: ["line1", "line2", "line3"],
        label: "測試"
      }
    })
    const textarea = wrapper.find("textarea")
    expect(textarea.element.value).toBe("line1\nline2\nline3")
  })

  it("emits string array on input", async function () {
    const wrapper = mount(TextareaArray, {
      props: {
        modelValue: [],
        label: "測試"
      }
    })
    const textarea = wrapper.find("textarea")
    await textarea.setValue("aaa\nbbb\nccc")
    const emitted = wrapper.emitted("update:modelValue")
    expect(emitted).toBeTruthy()
    const lastEmit = emitted[emitted.length - 1][0]
    expect(lastEmit).toEqual(["aaa", "bbb", "ccc"])
  })

  it("filters empty lines on emit", async function () {
    const wrapper = mount(TextareaArray, {
      props: {
        modelValue: [],
        label: "測試"
      }
    })
    const textarea = wrapper.find("textarea")
    await textarea.setValue("aaa\n\nbbb\n")
    const emitted = wrapper.emitted("update:modelValue")
    const lastEmit = emitted[emitted.length - 1][0]
    expect(lastEmit).toEqual(["aaa", "bbb"])
  })

  it("renders label", function () {
    const wrapper = mount(TextareaArray, {
      props: { modelValue: [], label: "公司名稱" }
    })
    expect(wrapper.find("label").text()).toBe("公司名稱")
  })
})
