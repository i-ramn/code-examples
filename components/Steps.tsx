enum Cases {
  notLoggedIn,
  loggedIn,
  loggedInParticipant,
}

export const Steps: FC = () => {
  const {
    root,
    title,
    subtitle,
    circlesContainer,
    circleItem,
    image,
    button,
    startIcon,
  } = useStyles();
  const [currentStep, setCurrentStep] = useState<number>(Cases.notLoggedIn);
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const shouldDisableTyket =
    currentStep === Cases.loggedIn || currentStep === Cases.loggedInParticipant;

  const shouldDisableStagewood =
    currentStep === Cases.notLoggedIn ||
    currentStep === Cases.loggedInParticipant;

  const handleLogin = useCallback(
    (isDisabled: boolean) => () => {
      if (isDisabled) {
        return undefined;
      }

      return navigate(Routes.LOGIN);
    },
    [navigate]
  );

  const handleBackground = useMemo(() => {
    if (currentStep === Cases.loggedIn) {
      return `url(${SECOND_STEP})`;
    }
    if (currentStep === Cases.loggedInParticipant) {
      return `url(${THIRD_STEP})`;
    }

    return `url(${FIRST_STEP})`;
  }, [currentStep]);

  const background = {
    backgroundImage: handleBackground,
  };

  const RenderTyketIcon = () => {
    if (shouldDisableTyket) {
      return TYKET_DISABLED;
    }

    return TYKET;
  };

  const RenderStagewoodIcon = () => {
    if (shouldDisableStagewood) {
      return STAGEWOOD_DISABLED;
    }

    return STAGEWOOD;
  };

  useEffect(() => {
    if (
      cookies[COOKIES.UNIFIEDLOGIN_BITRIX_ID] &&
      cookies[COOKIES.UNIFIEDLOGIN_BITRIX_ID] !== "undefined"
    ) {
      setCurrentStep(Cases.loggedIn);
    } else if (
      cookies[COOKIES.UNIFIEDLOGIN_BITRIX_EMAIL] &&
      cookies[COOKIES.UNIFIEDLOGIN_BITRIX_EMAIL] !== "undefined"
    ) {
      setCurrentStep(Cases.loggedIn);
    }
  }, [cookies]);

  return (
    <Container className={root}>
      <Typography variant="h2" className={title}>
        <span className={subtitle}>Your journey start with</span>
        <br />
        Two easy Steps
      </Typography>
      <Grid container bgcolor={background} className={circlesContainer}>
        <Grid className={circleItem} item container direction="column" gap={2}>
          <img className={image} src={RenderTyketIcon()} alt="tyket" />
          <OutlinedButton
            onClick={handleLogin(shouldDisableTyket)}
            disabled={shouldDisableTyket}
            className={button}
            startIcon={<Door className={startIcon} />}
          >
            Log In with Tyket
          </OutlinedButton>
        </Grid>
        <Grid className={circleItem} item container direction="column" gap={2}>
          <img className={image} src={RenderStagewoodIcon()} alt="stagewood" />
          <OutlinedButton
            disabled
            className={button}
            startIcon={<Logo className={startIcon} />}
          >
            Become a TykBroker
          </OutlinedButton>
        </Grid>
      </Grid>
    </Container>
  );
};
