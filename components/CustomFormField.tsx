"use client"

import * as React from "react"
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

import "react-phone-number-input/style.css"
import PhoneInput, { type Value } from "react-phone-number-input"

import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { fr } from "date-fns/locale"

import { FormFieldType } from "@/constants"

registerLocale("fr", fr)

interface CustomProps<
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>
> {
  control: Control<T>
  fieldType: FormFieldType
  name: TName
  label?: string
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  inputType?: React.HTMLInputTypeAttribute
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  renderSkeleton?: (
    field: ControllerRenderProps<T, TName>
  ) => React.ReactNode
}

const renderField = <
  T extends FieldValues,
  TName extends FieldPath<T>
>(
  field: ControllerRenderProps<T, TName>,
  props: CustomProps<T, TName>
): React.ReactNode => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    inputType,
    placeholder,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType}
              {...field}
              value={field.value ?? ""}
              onChange={
                inputType === "number"
                  ? (event) =>
                      field.onChange(
                        event.target.value === ""
                          ? undefined
                          : event.target.valueAsNumber
                      )
                  : field.onChange
              }
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      )

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      )

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <div className="input-phone">
            <PhoneInput
              defaultCountry="SN"
              placeholder={placeholder}
              international
              withCountryCallingCode
              value={field.value as Value | undefined}
              onChange={field.onChange}
            />
          </div>
        </FormControl>
      )

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      )

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="Calendrier"
            className="ml-2"
          />
          <DatePicker
            selected={field.value}
            onChange={(date: Date | null) => field.onChange(date)}
            dateFormat={dateFormat ?? "dd/MM/yyyy"}
            showTimeSelect={showTimeSelect ?? false}
            locale="fr"
            timeInputLabel="Heure :"
            timeFormat="HH:mm"
            wrapperClassName="date-picker"
            placeholderText={placeholder}
          />
        </div>
      )

    case FormFieldType.SELECT:
      return (
        <Select value={field.value ?? null} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="shad-select-content">
            {props.children}
          </SelectContent>
        </Select>
      )

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null

    default:
      return null
  }
}

const CustomFormField = <
  T extends FieldValues,
  TName extends FieldPath<T>
>(
  props: CustomProps<T, TName>
) => {
  const { control, fieldType, name, label } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          {renderField(field, props)}
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField