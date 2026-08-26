import { ArrowUp, Calendar, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PieLabelRenderProps } from 'recharts';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import Card from '../components/Card';
import MonthYearSelect from '../components/MonthYearSelect';
import {
	getTransactionSummary,
	getTransactionsMonthly,
} from '../services/transactionService';
import type { CategorySummary } from '../types/category';
import type { MonthlyItem, TransactionSummary } from '../types/transactions';
import { formatCurrency } from '../utils/formaters';

type ChartLabelProps = Omit<PieLabelRenderProps, 'payload'> & {
	payload?: CategorySummary;
};

const initialSummary: TransactionSummary = {
	balance: 0,
	totalExpenses: 0,
	totalIncomes: 0,
	expensesByCategory: [],
};

const Dashboard = () => {
	const currentDate = new Date();
	const [year, setYear] = useState<number>(currentDate.getFullYear());
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
	const [monthlyItemsData, setMonthlyItemsData] = useState<MonthlyItem[]>([]);

	useEffect(() => {
		async function loadTransactionsSummary() {
			const response = await getTransactionSummary(month, year);

			setSummary(response);
		}

		loadTransactionsSummary();
	}, [month, year]);

	useEffect(() => {
		async function loadTransactionsMonthly() {
			const response = await getTransactionsMonthly(month, year);

			console.log(response);
			setMonthlyItemsData(response.record);
		}

		loadTransactionsMonthly();
	}, [month, year]);

	const renderPieChartLabel = ({
		payload,
		percent,
	}: ChartLabelProps): string => {
		return `${payload?.categoryName ?? ''}: ${((percent ?? 0) * 100).toFixed(1)}%`;
	};

	const formatToolTipeValue = (value: unknown): string => {
		return formatCurrency(typeof value === 'number' ? value : 0);
	};

	const formatAxisValue = (value: unknown): string =>
		new Intl.NumberFormat('pt-br', {
			style: 'currency',
			currency: 'BRL',
			notation: 'compact',
			maximumFractionDigits: 1,
		}).format(typeof value === 'number' ? value : 0);

	const chartData = summary.expensesByCategory.map((item) => ({
		...item,
		fill: item.categoryColor,
	}));

	return (
		<div className="container-app py-6">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 md:mb-0">Dashborad</h1>
				<MonthYearSelect
					month={month}
					year={year}
					onMonthChange={setMonth}
					onYearChange={setYear}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card
					icon={<Wallet size={20} className="text-primary-500" />}
					title="Saldo"
					hover
					glowEffect={summary.balance > 0}
				>
					<p
						className={`text-2xl font-semibold mt-2
					${summary.balance > 0 ? 'text-primary-500' : 'text-red-300'}
					`}
					>
						{formatCurrency(summary.balance)}
					</p>
				</Card>
				<Card
					icon={<ArrowUp size={20} className="text-primary-500" />}
					title="Receitas"
					hover
				>
					<p className="text-2xl font-semibold mt-2 text-primary-500">
						{formatCurrency(summary.totalIncomes)}
					</p>
				</Card>
				<Card
					icon={<Wallet size={20} className="text-red-600" />}
					title="Despesas"
					hover
				>
					<p className="text-2xl font-semibold mt-2 text-red-600">
						{formatCurrency(summary.totalExpenses)}
					</p>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-3">
				<Card
					icon={<TrendingUp size={20} className="text-primary-500" />}
					title="Despesas por Categoria"
					className="min-h-80"
					hover
				>
					{summary.expensesByCategory.length > 0 ? (
						<div className="h-72 mt-4">
							<ResponsiveContainer>
								<PieChart>
									<Pie
										data={chartData}
										cx="50%"
										cy="50%"
										outerRadius={80}
										dataKey="amount"
										nameKey="categoryName"
										label={renderPieChartLabel}
									/>
									<Tooltip formatter={formatToolTipeValue} />
								</PieChart>
							</ResponsiveContainer>
						</div>
					) : (
						<div className="flex items-center justify-center h-64 text-gray-500">
							Nenhuma entrada registrada nesse período
						</div>
					)}
				</Card>
				<Card
					icon={<Calendar size={20} className="text-primary-500" />}
					title="Histórico Mensal"
					className="min-h-80"
					hover
				>
					<div className="h-72 mt-4">
						{monthlyItemsData.length > 0 ? (
							<BarChart
								style={{
									width: '100%',
									maxWidth: '700px',
									maxHeight: '70vh',
									aspectRatio: 1.618,
								}}
								responsive
								data={monthlyItemsData}
								margin={{
									top: 5,
									right: 0,
									left: 0,
									bottom: 5,
								}}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="rgba(255, 255, 255, 0.1)"
								/>
								<XAxis
									dataKey="name"
									stroke="#94a3b8"
									tick={{ style: { textTransform: 'capitalize' } }}
								/>
								<YAxis
									width={82}
									tickFormatter={formatAxisValue}
									stroke="#94a3b8"
								/>
								<Tooltip
									formatter={formatToolTipeValue}
									contentStyle={{
										backgroundColor: '#1a1a1a',
										borderColor: '#2a2a2a',
									}}
									labelStyle={{ color: '#f8f8f8', textTransform: 'capitalize' }}
								/>
								<Legend />
								<Bar dataKey="income" fill="#37E359" radius={[10, 10, 0, 0]} />
								<Bar
									dataKey="expenses"
									fill="#FF6384"
									radius={[10, 10, 0, 0]}
								/>
							</BarChart>
						) : (
							<div className="flex items-center justify-center h-64 text-gray-500">
								Nenhuma entrada registrada nesse período
							</div>
						)}
					</div>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
