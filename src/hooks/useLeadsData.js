import { useState, useEffect, useCallback, useRef } from "react";
import { leadsService } from "../services/leadsService";
import { calculateMetrics } from "../utils/metricsCalculator";

const USE_REALTIME = false;
const POLLING_INTERVAL = 120000; // 2 minutos

export const useLeadsData = (dateRange = null) => {
	const [data, setData] = useState([]);
	const [metrics, setMetrics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdate, setLastUpdate] = useState(null);
	const isMountedRef = useRef(true);

	const fetchData = useCallback(async () => {
		if (!isMountedRef.current) return;

		try {
			setLoading(true);
			setError(null);

			const leads = await leadsService.fetchAll();

			if (!isMountedRef.current) return;

			setData(leads);
			setMetrics(calculateMetrics(leads, dateRange));
			setLastUpdate(new Date());
		} catch (err) {
			if (isMountedRef.current) {
				setError(err.message);
			}
		} finally {
			if (isMountedRef.current) {
				setLoading(false);
			}
		}
	}, [dateRange]);

	useEffect(() => {
		isMountedRef.current = true;
		fetchData();

		const interval = setInterval(fetchData, POLLING_INTERVAL);
		let subscription = null;

		if (USE_REALTIME) {
			leadsService
				.subscribeToChanges(fetchData)
				.then((channel) => {
					subscription = channel;
				})
				.catch(() => {}); // Silently fail to polling
		}

		return () => {
			isMountedRef.current = false;
			clearInterval(interval);
			subscription?.unsubscribe?.().catch(() => {});
		};
	}, [fetchData]);

	return {
		data,
		metrics,
		loading,
		error,
		refetch: fetchData,
		lastUpdate,
		realtimeEnabled: USE_REALTIME,
	};
};
