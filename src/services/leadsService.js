import { supabase } from "../config/supabase";

export const leadsService = {
	async fetchAll(startDate = null, endDate = null) {
		let query = supabase.from("leads_qualificados2").select("*");

		if (startDate) {
			query = query.gte("data_hora", startDate);
		}
		if (endDate) {
			query = query.lte("data_hora", endDate);
		}

		const { data, error } = await query.order("data_hora", {
			ascending: false,
		});

		if (error) throw error;
		return data || [];
	},

	async fetchByDateRange(startDate, endDate) {
		const { data, error } = await supabase
			.from("leads_qualificados2")
			.select("*")
			.gte("data_hora", startDate)
			.lte("data_hora", endDate)
			.order("data_hora", { ascending: false });

		if (error) throw error;
		return data || [];
	},

	async subscribeToChanges(callback) {
		try {
			const channel = supabase
				.channel("leads_changes")
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "leads_qualificados2",
					},
					callback
				)
				.subscribe((status) => {
					if (status === "SUBSCRIPTION_ERROR") {
						console.warn(
							"Realtime subscription error - using polling fallback"
						);
					}
				});

			return channel;
		} catch (error) {
			console.warn("Realtime not available - using polling fallback", error);
			return null;
		}
	},
};
