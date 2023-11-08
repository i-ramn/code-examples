const getSchema = (t: TranslateFunction) =>
  yup.object({
    phone: yup.string().test({
      message: t("validation_error.phone_error"),
      test: (value) => {
        const number = parsePhoneNumberFromString(value || "");

        return Boolean(number?.isValid());
      },
    }),
    country: yup.object({
      name: yup.object({ en: yup.string() }),
      dial_code: yup.string(),
      code: yup.string(),
      flag: yup.string(),
    }),
  });

export type PhoneAuthFormData = yup.Asserts<ReturnType<typeof getSchema>> & {
  country: Country;
};

export type OnPhoneAuthForm = OnSubmit<PhoneAuthFormData>;

export const usePhoneAuthForm = (onSubmit: OnPhoneAuthForm) => {
  const { t } = useTranslate();

  return useForm<PhoneAuthFormData>({
    initialValues: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      country: useRef(getDefaultCountry()!).current,
      phone: "+1",
    },
    onSubmit,
    validationSchema: getSchema(t),
  });
};
