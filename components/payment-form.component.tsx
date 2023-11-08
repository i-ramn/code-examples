const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.white,
  width: theme.spacing(45),
  maxWidth: "100%",
}));

export interface PaymentFormProps {
  cartHolderName: string;
  setCartHolderName: (value: string) => void;
}

const stripeInputOptions = {
  style: {
    base: {
      color: palette.text?.primary,
      fontSize: "1.14rem",
      fontFamily: FontFamilyEnum.ROBOTO_FLEX,
      lineHeight: "1.4375em",
      "::placeholder": {
        color: "#949eb5",
      },
    },
  } as StripeElementStyle,
};

export const PaymentForm: FC<PaymentFormProps> = ({
  cartHolderName,
  setCartHolderName,
}) => {
  const intl = useIntl();

  const handleCardHolderNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCartHolderName(event.target.value);
    },
    [setCartHolderName]
  );

  return (
    <GrayInfoBox p={4}>
      <GrayInfoBoxHeader variant="h5" mb={2}>
        <FormattedMessage id="payment-method.header" />
      </GrayInfoBoxHeader>
      <Typography mb={4}>
        <FormattedMessage id="payment-method.description" />
      </Typography>
      <Stack spacing={2.5}>
        <InputHolder direction="row" alignItems="center">
          <FormInputLabel
            label={intl.formatMessage({
              id: "payment-method.cardholder-name-label",
            })}
            required
          />
          <StyledTextField
            placeholder={intl.formatMessage({
              id: "payment-method.cardholder-name-label",
            })}
            size="small"
            value={cartHolderName}
            onChange={handleCardHolderNameChange}
          />
        </InputHolder>
        <InputHolder direction="row" alignItems="center">
          <FormInputLabel
            label={intl.formatMessage({ id: "payment-method.card-number" })}
            required
          />
          <StyledTextField
            placeholder={intl.formatMessage({
              id: "payment-method.card-number",
            })}
            size="small"
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardNumberElement,
                options: stripeInputOptions,
              },
            }}
          />
        </InputHolder>
        <InputHolder direction="row" alignItems="center">
          <FormInputLabel
            label={intl.formatMessage({ id: "payment-method.expiration-date" })}
            required
          />
          <StyledTextField
            placeholder={intl.formatMessage({
              id: "payment-method.expiration-date",
            })}
            size="small"
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardExpiryElement,
                options: stripeInputOptions,
              },
            }}
          />
        </InputHolder>
        <InputHolder direction="row" alignItems="center">
          <FormInputLabel
            label={intl.formatMessage({ id: "payment-method.cvv" })}
            required
          />
          <StyledTextField
            placeholder={intl.formatMessage({ id: "payment-method.cvv" })}
            size="small"
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardCvcElement,
                options: stripeInputOptions,
              },
              endAdornment: (
                <Tooltip
                  title={intl.formatMessage({
                    id: "payment-method.cvv-tooltip-label",
                  })}
                  placement="right"
                  arrow
                >
                  <span>
                    <InfoIconOutlined size={14} />
                  </span>
                </Tooltip>
              ),
            }}
          />
        </InputHolder>
      </Stack>
    </GrayInfoBox>
  );
};
