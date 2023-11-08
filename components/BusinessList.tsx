const PAGE_SIZE = 10;

export const BusinessListScreen: Screen<Routes.BusinessListScreen> = ({
  route: {
    params: {
      activeCategory: activeCategoryPassed,
      islandId,
      islandName,
      isMapIconShown,
    },
  },
  navigation,
}) => {
  const { data: businesses } = useBusinessesQuery(islandId, {
    withCache: true,
  });
  const { data: categories } = useBusinessCategoriesQuery({ withCache: true });
  const [activeCategory, setActiveCategory] = useState<BusinessCategory | null>(
    null
  );

  useEffect(() => {
    if (activeCategoryPassed) {
      setActiveCategory(activeCategoryPassed as BusinessCategory | null);
    }
  }, [activeCategoryPassed]);

  const [displayedCount, setDisplayedCount] = useState(PAGE_SIZE);

  const getMainCategory = useCallback(
    (categoryId: number) =>
      categories?.find((category) => category.id === categoryId),
    [categories]
  );

  const handleActiveCategoryChange = useCallback(
    (category: BusinessCategory | null) => setActiveCategory(category),
    []
  );

  const { t } = useTranslate();
  const [styles, theme] = useStyles();
  const { setOptions, navigate } = useNavigation<"stack">();

  const filteredBusinesses = useMemo(() => {
    return businesses?.reduce((result: BusinessModel[], business) => {
      const mainCategory = getMainCategory(business.category_id);
      const combinedCategories = mainCategory
        ? [mainCategory, ...business.categories]
        : business.categories;

      if (
        !activeCategory ||
        combinedCategories.some((category) => category.id === activeCategory.id)
      ) {
        if (result.length < displayedCount) {
          result.push({ ...business, categories: combinedCategories });
        }
      }
      return result;
    }, []);
  }, [businesses, activeCategory, displayedCount, getMainCategory]);

  const loadMoreItems = () => {
    setDisplayedCount((currentCount) => currentCount + PAGE_SIZE);
  };

  const renderItem = useCallback(
    ({ item }: { item: BusinessModel }) => (
      <BusinessCard
        onPress={() => navigation.navigate(Routes.BusinessDetailsScreen, item)}
        categories={item.categories}
        title={item.business_name}
        subTitle={item.city}
        uri={item.photos?.[0]}
      />
    ),
    [navigation]
  );

  const renderHeader = useCallback(
    () => (
      <Box mb={20}>
        <BusinessCategories
          activeCategory={activeCategory}
          setActiveCategory={handleActiveCategoryChange}
        />
      </Box>
    ),
    [activeCategory, handleActiveCategoryChange]
  );

  const onHeaderMapIconPress = useCallback(() => {
    navigate(Routes.BusinessMapScreen, { category: activeCategory, islandId });
  }, [activeCategory, navigate, islandId]);

  const headerRight = useCallback(
    () =>
      !isMapIconShown ? (
        <Svg.Map color={theme.colors.black} onPress={onHeaderMapIconPress} />
      ) : null,
    [isMapIconShown, onHeaderMapIconPress, theme.colors.black]
  );

  useLayoutEffect(() => {
    setOptions({
      headerRight,
    });
  }, [headerRight, setOptions]);

  return (
    <Box>
      {!!islandName && (
        <Typography variants="P2" style={styles.islandName}>
          {islandName}
        </Typography>
      )}
      <Typography style={styles.title} variants="H4Title">
        {t("things_to_do")}
      </Typography>

      {renderHeader()}
      <FlatList
        data={filteredBusinesses}
        renderItem={renderItem}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        initialNumToRender={PAGE_SIZE}
        stickyHeaderHiddenOnScroll
        contentContainerStyle={styles.flatList}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <NotFoundComponent text={t("business_events_not_found")} />
        )}
      />
    </Box>
  );
};

BusinessListScreen.options = () => ({
  headerTitle: "",
});
