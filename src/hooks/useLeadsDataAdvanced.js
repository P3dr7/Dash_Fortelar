import { useState, useEffect, useCallback } from "react";
import { leadsService } from "../services/leadsService";
import { calculateMetrics } from "../utils/metricsCalculator";

const USE_REALTIME = false;

export const useLeadsData = (dateRange = null) => {
	const [data, setData] = useState([]);
	const [allData, setAllData] = useState([]);
	const [metrics, setMetrics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdate, setLastUpdate] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			let leads;
			if (dateRange?.start && dateRange?.end) {
				leads = await leadsService.fetchByDateRange(
					dateRange.start,
					dateRange.end
				);
			} else {
				leads = await leadsService.fetchAll();
			}

			setData(leads);
			setAllData(leads);
			setMetrics(calculateMetrics(leads, dateRange));
			setLastUpdate(new Date());
		} catch (err) {
			console.error("Erro ao buscar dados:", err);
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [dateRange]);

	useEffect(() => {
		fetchData();

		const interval = setInterval(fetchData, 30000);

		let subscription = null;
		if (USE_REALTIME) {
			leadsService
				.subscribeToChanges(() => {
					fetchData();
				})
				.then((channel) => {
					subscription = channel;
					if (channel) {
						console.log("✅ Realtime conectado");
					}
				})
				.catch(() => {
					console.log("ℹ️ Realtime desabilitado - usando apenas polling");
				});
		}

		return () => {
			clearInterval(interval);
			if (subscription) {
				subscription.unsubscribe().catch(() => {});
			}
		};
	}, [fetchData]);

	return {
		data,
		allData,
		metrics,
		loading,
		error,
		refetch: fetchData,
		lastUpdate,
		realtimeEnabled: USE_REALTIME,
	};
};
