import {useEffect, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import type {RootStackScreenProps} from '../../../navigation/types';
import {
  usePagedList,
  usePageStyle,
} from '../../../shared/hooks';
import {EmptyState, FeedbackDialog} from '../../../shared/components';
import {colors, layout, radius, shadows, sizes, spacing, typography} from '../../../shared/theme';
import {formatInrCompact} from '../../../shared/utils/formatCurrency';
import {
  EMPTY_HOME_FILTERS,
  hasActiveHomeFilters,
  type Expense,
  type HomeFilters,
} from '../../../types';
import DeleteExpenseSheet from '../components/DeleteExpenseSheet';
import LogoutConfirmSheet from '../components/LogoutConfirmSheet';
import ExpenseListItem from '../components/ExpenseListItem';
import ExpenseListShimmer from '../components/ExpenseListShimmer';
import HomeFilterSheet from '../components/HomeFilterSheet';
import HomeSearchBar from '../components/HomeSearchBar';
import StatCard from '../components/StatCard';
import StatCardShimmer from '../components/StatCardShimmer';
import { useExpenses, useDeleteExpense } from '../../expenses/hooks';
import { useDebouncedSearch, useCurrentUser, useLogout, useLedgerStats } from '../hooks';

const noExpenseIcon = require('../../../../assets/icons/no_expense_icon.webp');
const noSearchFoundIcon = require('../../../../assets/icons/no_search_found.webp');

// Ledger home: stats, search/filter, paged list, FAB to add, logout in the header.
const HomeScreen = ({navigation}: RootStackScreenProps<'Home'>) => {
  const pageStyle = usePageStyle();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<HomeFilters>(EMPTY_HOME_FILTERS);
  const [filterVisible, setFilterVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense>();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const filtersActive = hasActiveHomeFilters(filters);
  const activeSearch = useDebouncedSearch(searchQuery);
  const {expenses, loading, error} = useExpenses({
    search: activeSearch,
    categoryIds: filters.categoryIds,
    fromDate: filters.fromDate,
    endDate: filters.endDate,
  });
  const {deleteExpense} = useDeleteExpense();
  const user = useCurrentUser();
  const {logout} = useLogout();
  const {allTimeTotal, thisMonthTotal, transactionCount} = useLedgerStats();

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const showError = (caught: unknown, fallback: string) => {
    setErrorMessage(caught instanceof Error ? caught.message : fallback);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Spendly',
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTitleStyle: {
        ...typography.title,
        color: colors.text,
      },
      headerRight: () => (
        <Pressable
          onPress={() => setLogoutVisible(true)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Log out">
          <Ionicons
            name="log-out-outline"
            size={sizes.iconLg}
            color={colors.text}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  const monthSubtitle = new Date().toLocaleString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
  const currentMonth = new Date().toLocaleString('en-IN', {month: 'long'});

  const {pagedItems, hasMore, loadMore} = usePagedList(expenses);
  const showAddFab = expenses.length > 0;

  const stats = [
    {
      label: 'All-Time',
      value: formatInrCompact(allTimeTotal),
      subtitle: 'Total Spent',
    },
    {
      label: 'This Month',
      value: formatInrCompact(thisMonthTotal),
      subtitle: monthSubtitle,
    },
    {
      label: 'Transactions',
      value: String(transactionCount),
      subtitle: 'Recorded',
    },
  ];

  return (
    <View style={[pageStyle.page, styles.page]}>
      <FlatList
        data={pagedItems}
        keyExtractor={item => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={[
          pageStyle.content,
          styles.listContent,
          {
            paddingBottom:
              (showAddFab ? sizes.fab + spacing[10] : spacing[8]) +
              insets.bottom,
          },
        ]}
        ListHeaderComponent={
          <>
            <Text style={styles.welcome} numberOfLines={1}>
              Welcome {user?.name ?? user?.email ?? 'there'}
            </Text>
            <View style={styles.summary}>
              <Text style={styles.summaryKicker}>SUMMARY ANALYTICS</Text>
              <Text style={styles.summaryTitle}>Overview</Text>
              <View style={styles.statsRow}>
                {loading
                  ? [0, 1, 2].map(index => <StatCardShimmer key={index} />)
                  : stats.map(stat => (
                      <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        subtitle={stat.subtitle}
                      />
                    ))}
              </View>
            </View>
            <HomeSearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              filterActive={filtersActive}
              onFilterPress={() => setFilterVisible(true)}
            />
          </>
        }
        renderItem={({item}) => (
          <ExpenseListItem
            expense={item}
            onPress={() =>
              navigation.navigate('EditExpense', {expenseId: item.id})
            }
            onDeletePress={() => setExpenseToDelete(item)}
          />
        )}
        ListFooterComponent={
          hasMore && !loading ? (
            <ActivityIndicator
              color={colors.primary}
              style={styles.pageLoader}
            />
          ) : undefined
        }
        ListEmptyComponent={
          loading ? (
            <ExpenseListShimmer />
          ) : activeSearch || filtersActive ? (
            <EmptyState
              image={noSearchFoundIcon}
              title="No results found"
              description="We couldn't find any transactions matching your search or filters."
              actionTitle="Clear Search & Filters"
              onActionPress={() => {
                setSearchQuery('');
                setFilters(EMPTY_HOME_FILTERS);
              }}
            />
          ) : (
            <EmptyState
              image={noExpenseIcon}
              title="No expenses recorded yet"
              description={`Your ${currentMonth} ledger is completely empty.\nLog your first expense or connect your account to automatically monitor your safe-to-spend pace.`}
              actionTitle="Add your first expense"
              onActionPress={() => navigation.navigate('AddExpense')}
            />
          )
        }
      />
      {expenses.length > 0 ? (
        <Pressable
          onPress={() => navigation.navigate('AddExpense')}
          accessibilityRole="button"
          accessibilityLabel="Add expense"
          style={[
            styles.fab,
            {bottom: Math.max(insets.bottom, spacing[4])},
          ]}>
          <Ionicons name="add" size={sizes.iconLg} color={colors.white} />
        </Pressable>
      ) : null}
      <HomeFilterSheet
        visible={filterVisible}
        filters={filters}
        onApply={nextFilters => {
          setFilters(nextFilters);
          setFilterVisible(false);
        }}
        onClose={() => setFilterVisible(false)}
      />
      <LogoutConfirmSheet
        visible={logoutVisible}
        email={user?.name ?? user?.email}
        onClose={() => setLogoutVisible(false)}
        onConfirm={async () => {
          try {
            await logout();
            setLogoutVisible(false);
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          } catch (caught) {
            setLogoutVisible(false);
            showError(
              caught,
              'Something went wrong while signing out. Please try again.',
            );
          }
        }}
      />
      <DeleteExpenseSheet
        expense={expenseToDelete}
        visible={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(undefined)}
        onConfirm={() => {
          try {
            if (expenseToDelete) {
              deleteExpense(expenseToDelete.id);
            }
            setExpenseToDelete(undefined);
          } catch (caught) {
            setExpenseToDelete(undefined);
            showError(
              caught,
              'Something went wrong while deleting this record. Please try again.',
            );
          }
        }}
      />
      <FeedbackDialog
        visible={Boolean(errorMessage)}
        variant="error"
        title="Something went wrong"
        message={errorMessage ?? ''}
        actionTitle="Try Again"
        onClose={() => setErrorMessage(undefined)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
  },
  welcome: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing[4],
  },
  listContent: {
    gap: spacing[2],
  },
  fab: {
    position: 'absolute',
    right: layout.screenPadding,
    width: sizes.fab,
    height: sizes.fab,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floating,
  },
  summary: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: spacing[4],
    marginTop: spacing[4],
  },
  summaryKicker: {
    ...typography.caption,
    color: colors.textOnPrimary,
    letterSpacing: 0.6,
  },
  summaryTitle: {
    ...typography.title,
    color: colors.textOnPrimary,
    marginTop: spacing[1],
    marginBottom: spacing[4],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  pageLoader: {
    paddingVertical: spacing[4],
  },
});

export default HomeScreen;
