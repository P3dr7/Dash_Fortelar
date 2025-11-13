import { useState, useEffect, useCallback } from "react";
import { leadsService } from "../services/leadsService";
import { calculateMetrics } from "../utils/metricsCalculator";

// Define se quer usar Realtime ou apenas polling
const USE_REALTIME = false; // Mude para true para habilitar Realtime

export const useLeadsData = (dateRange = null) => {
	const [data, setData] = useState([]);
	const [metrics, setMetrics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [lastUpdate, setLastUpdate] = useState(null);

	const fetchData = useCallback(async () => {
		try {
			console.log("🔄 Iniciando busca de dados...");
			setLoading(true);
			setError(null);
			const leads = await leadsService.fetchAll();
			console.log("✅ Dados recebidos:", leads?.length, "leads");
			setData(leads);
			const calculatedMetrics = calculateMetrics(leads, dateRange);
			console.log("✅ Métricas calculadas:", calculatedMetrics);
			setMetrics(calculatedMetrics);
			setLastUpdate(new Date());
		} catch (err) {
			console.error("❌ Erro ao buscar dados:", err);
			setError(err.message);
		} finally {
			setLoading(false);
			console.log("✅ Loading finalizado");
		}
	}, [dateRange]);

	useEffect(() => {
		fetchData();

		// Polling a cada 2 minutos (120000ms)
		const interval = setInterval(fetchData, 1200000);

		// Realtime (apenas se habilitado)
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
		metrics,
		loading,
		error,
		refetch: fetchData,
		lastUpdate,
		realtimeEnabled: USE_REALTIME,
	};
};
