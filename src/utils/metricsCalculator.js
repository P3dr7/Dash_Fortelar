import {
	startOfDay,
	endOfDay,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
	subDays,
	subWeeks,
	subMonths,
	isWithinInterval,
	format,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export const calculateMetrics = (leads, dateRange = null) => {
	if (!leads || leads.length === 0) {
		return {
			total: 0,
			totalAtivos: 0,
			totalInativos: 0,
			porCanal: {},
			porSituacao: {},
			porEstadoCivil: {},
			porFilhosMenores: {},
			porPrimeiroFinanciamento: {},
			followUpStats: {},
			enviosPorDia: [],
			taxaConversao: 0,
			leadsPorHora: {},
			tendenciasDiarias: [],
			comparativoPeriodo: {},
			docsProcessados: 0,
			docsNaoProcessados: 0,
			jaProcessados: 0,
			naoProcessados: 0,
		};
	}

	// IMPORTANTE: Os totais devem SEMPRE ser sobre TODOS os leads, independente do período
	const total = leads.length;
	const totalAtivos = leads.filter((l) => l.situacao === "ativo").length;
	const totalInativos = leads.filter((l) => l.situacao === "inativo").length;

	const porCanal = leads.reduce((acc, lead) => {
		const canal = lead.canal || "Não especificado";
		acc[canal] = (acc[canal] || 0) + 1;
		return acc;
	}, {});

	const porSituacao = leads.reduce((acc, lead) => {
		const situacao = lead.situacao || "Não especificado";
		acc[situacao] = (acc[situacao] || 0) + 1;
		return acc;
	}, {});

	const porEstadoCivil = leads.reduce((acc, lead) => {
		const estadoCivil = lead.estado_civil || "Não especificado";
		acc[estadoCivil] = (acc[estadoCivil] || 0) + 1;
		return acc;
	}, {});

	const porFilhosMenores = leads.reduce((acc, lead) => {
		const temFilhos = lead.tem_filhos_menores || "Não especificado";
		acc[temFilhos] = (acc[temFilhos] || 0) + 1;
		return acc;
	}, {});

	const porPrimeiroFinanciamento = leads.reduce((acc, lead) => {
		const primeiro = lead.primeiro_financiamento || "Não especificado";
		acc[primeiro] = (acc[primeiro] || 0) + 1;
		return acc;
	}, {});

	// Follow-up stats - SEMPRE baseado em todos os leads
	// CORRIGIDO: Verificar data_envio para saber se foi enviado
	const followUpStats = {};
	for (let i = 1; i <= 14; i++) {
		const dataEnvioField = "data_envio" + i;
		const followUpField = "follow_up" + i;

		// Enviados: têm data_envio preenchida
		const enviados = leads.filter((l) => l[dataEnvioField] != null).length;

		// Respondidos: follow_up contém "sim" ou texto indicando resposta
		const respondidos = leads.filter(
			(l) =>
				l[followUpField] &&
				(l[followUpField].toLowerCase() === "sim" ||
					l[followUpField].toLowerCase().includes("respondeu") ||
					l[followUpField].toLowerCase().includes("resposta"))
		).length;

		// Pendentes: não têm data_envio mas estão na sequência
		const pendentes = 0; // Não temos como identificar pendentes com essa estrutura

		if (enviados > 0 || respondidos > 0) {
			followUpStats["Follow-up " + i] = {
				enviados,
				pendentes,
				respondidos,
				total: enviados,
			};
		}
	}

	// Follow-up 9B (caso especial)
	if (leads.some((l) => l.data_envio9B != null)) {
		const enviados9B = leads.filter((l) => l.data_envio9B != null).length;
		const respondidos9B = leads.filter(
			(l) =>
				l.follow_up9B &&
				(l.follow_up9B.toLowerCase() === "sim" ||
					l.follow_up9B.toLowerCase().includes("respondeu"))
		).length;

		followUpStats["Follow-up 9B"] = {
			enviados: enviados9B,
			pendentes: 0,
			respondidos: respondidos9B,
			total: enviados9B,
		};
	}

	const enviosPorDia = [];
	const today = new Date();
	for (let i = 29; i >= 0; i--) {
		const dia = subDays(today, i);
		const diaFormatado = format(dia, "dd/MM", { locale: ptBR });

		let totalEnvios = 0;
		for (let j = 1; j <= 14; j++) {
			const dataEnvioField = "data_envio" + j;
			totalEnvios += leads.filter((lead) => {
				if (!lead[dataEnvioField]) return false;
				const dataEnvio = new Date(lead[dataEnvioField]);
				return format(dataEnvio, "yyyy-MM-dd") === format(dia, "yyyy-MM-dd");
			}).length;
		}

		// Incluir follow_up9B
		totalEnvios += leads.filter((lead) => {
			if (!lead.data_envio9B) return false;
			const dataEnvio = new Date(lead.data_envio9B);
			return format(dataEnvio, "yyyy-MM-dd") === format(dia, "yyyy-MM-dd");
		}).length;

		enviosPorDia.push({ dia: diaFormatado, envios: totalEnvios });
	}

	const leadsPorHora = leads.reduce((acc, lead) => {
		if (!lead.data_hora) return acc;
		const hora = new Date(lead.data_hora).getHours();
		acc[hora] = (acc[hora] || 0) + 1;
		return acc;
	}, {});

	const tendenciasDiarias = [];
	for (let i = 6; i >= 0; i--) {
		const dia = subDays(today, i);
		const diaFormatado = format(dia, "dd/MM", { locale: ptBR });

		const leadsNoDia = leads.filter((lead) => {
			if (!lead.data_hora) return false;
			return (
				format(new Date(lead.data_hora), "yyyy-MM-dd") ===
				format(dia, "yyyy-MM-dd")
			);
		});

		tendenciasDiarias.push({
			dia: diaFormatado,
			total: leadsNoDia.length,
			ativos: leadsNoDia.filter((l) => l.situacao === "ativo").length,
			inativos: leadsNoDia.filter((l) => l.situacao === "inativo").length,
		});
	}

	const taxaConversao =
		total > 0 ? ((totalAtivos / total) * 100).toFixed(1) : 0;

	// Comparativo de período - compara MENSAGENS ENVIADAS, não leads cadastrados
	let comparativoPeriodo = {};
	if (dateRange?.start && dateRange?.end) {
		const periodoDias = Math.ceil(
			(new Date(dateRange.end) - new Date(dateRange.start)) /
				(1000 * 60 * 60 * 24)
		);
		const periodoAnteriorStart = subDays(
			new Date(dateRange.start),
			periodoDias
		);
		const periodoAnteriorEnd = subDays(new Date(dateRange.end), periodoDias);

		// Contar mensagens enviadas no período anterior
		let mensagensPeriodoAnterior = 0;
		leads.forEach((lead) => {
			for (let j = 1; j <= 14; j++) {
				const dataEnvioField = "data_envio" + j;

				if (lead[dataEnvioField]) {
					const dataEnvio = new Date(lead[dataEnvioField]);

					if (
						isWithinInterval(dataEnvio, {
							start: periodoAnteriorStart,
							end: periodoAnteriorEnd,
						})
					) {
						mensagensPeriodoAnterior++;
					}
				}
			}

			// Incluir follow_up9B
			if (lead.data_envio9B) {
				const dataEnvio = new Date(lead.data_envio9B);
				if (
					isWithinInterval(dataEnvio, {
						start: periodoAnteriorStart,
						end: periodoAnteriorEnd,
					})
				) {
					mensagensPeriodoAnterior++;
				}
			}
		});

		// Contar mensagens do período atual (será calculado mais abaixo)
		let mensagensPeriodoAtual = 0;
		leads.forEach((lead) => {
			for (let j = 1; j <= 14; j++) {
				const dataEnvioField = "data_envio" + j;

				if (lead[dataEnvioField]) {
					const dataEnvio = new Date(lead[dataEnvioField]);

					if (
						isWithinInterval(dataEnvio, {
							start: new Date(dateRange.start),
							end: new Date(dateRange.end),
						})
					) {
						mensagensPeriodoAtual++;
					}
				}
			}

			// Incluir follow_up9B
			if (lead.data_envio9B) {
				const dataEnvio = new Date(lead.data_envio9B);
				if (
					isWithinInterval(dataEnvio, {
						start: new Date(dateRange.start),
						end: new Date(dateRange.end),
					})
				) {
					mensagensPeriodoAtual++;
				}
			}
		});

		const variacaoTotal = mensagensPeriodoAtual - mensagensPeriodoAnterior;
		const variacaoPercentual =
			mensagensPeriodoAnterior > 0
				? ((variacaoTotal / mensagensPeriodoAnterior) * 100).toFixed(1)
				: mensagensPeriodoAtual > 0
				? 100
				: 0;

		comparativoPeriodo = {
			totalAtual: mensagensPeriodoAtual,
			totalAnterior: mensagensPeriodoAnterior,
			variacao: variacaoTotal,
			variacaoPercentual: parseFloat(variacaoPercentual),
		};
	}

	const docsProcessados = leads.filter((l) => l.docProcessado === "sim").length;
	const docsNaoProcessados = leads.filter(
		(l) => l.docProcessado === "nao"
	).length;
	const jaProcessados = leads.filter((l) => l.ja_processado === "sim").length;
	const naoProcessados = leads.filter((l) => l.ja_processado === "nao").length;

	// Total de mensagens enviadas (SEMPRE TOTAL GERAL)
	// CORRIGIDO: Contar quantos data_envio existem
	let totalMensagensEnviadas = 0;
	leads.forEach((lead) => {
		for (let i = 1; i <= 14; i++) {
			const dataEnvioField = "data_envio" + i;
			if (lead[dataEnvioField] != null) {
				totalMensagensEnviadas++;
			}
		}
		// Incluir follow_up9B
		if (lead.data_envio9B != null) {
			totalMensagensEnviadas++;
		}
	});

	// Mensagens enviadas no período selecionado (não apenas hoje)
	// IMPORTANTE: usar 'leads' ao invés de 'filteredLeads' pois queremos contar
	// baseado em data_envio, não em data_hora do lead
	let mensagensEnviadasPeriodo = 0;
	const mensagensPorHora = Array(24).fill(0); // Array para contar mensagens por hora (0-23)

	if (dateRange?.start && dateRange?.end) {
		// Iterar por todos os leads
		leads.forEach((lead) => {
			// Verificar cada campo data_envio1 até data_envio14
			for (let j = 1; j <= 14; j++) {
				const dataEnvioField = "data_envio" + j;

				if (lead[dataEnvioField]) {
					const dataEnvio = new Date(lead[dataEnvioField]);

					// Verificar se está dentro do período
					if (
						isWithinInterval(dataEnvio, {
							start: new Date(dateRange.start),
							end: new Date(dateRange.end),
						})
					) {
						mensagensEnviadasPeriodo++;
						const hora = dataEnvio.getHours();
						mensagensPorHora[hora]++;
					}
				}
			}

			// Incluir follow_up9B
			if (lead.data_envio9B) {
				const dataEnvio = new Date(lead.data_envio9B);
				if (
					isWithinInterval(dataEnvio, {
						start: new Date(dateRange.start),
						end: new Date(dateRange.end),
					})
				) {
					mensagensEnviadasPeriodo++;
					const hora = dataEnvio.getHours();
					mensagensPorHora[hora]++;
				}
			}
		});
	} else {
		// Se não há período selecionado, mostrar de hoje
		const hoje = new Date();
		const hojeStr = format(hoje, "yyyy-MM-dd");

		leads.forEach((lead) => {
			for (let j = 1; j <= 14; j++) {
				const dataEnvioField = "data_envio" + j;

				if (lead[dataEnvioField]) {
					const dataEnvio = new Date(lead[dataEnvioField]);

					if (format(dataEnvio, "yyyy-MM-dd") === hojeStr) {
						mensagensEnviadasPeriodo++;
						const hora = dataEnvio.getHours();
						mensagensPorHora[hora]++;
					}
				}
			}

			// Incluir follow_up9B
			if (lead.data_envio9B) {
				const dataEnvio = new Date(lead.data_envio9B);
				if (format(dataEnvio, "yyyy-MM-dd") === hojeStr) {
					mensagensEnviadasPeriodo++;
					const hora = dataEnvio.getHours();
					mensagensPorHora[hora]++;
				}
			}
		});
	}

	// Converter array em formato para o gráfico
	// Se houver período selecionado (múltiplos dias), mostrar todas as 24 horas
	// Se não houver período (apenas hoje), mostrar até a hora atual
	const horaAtual = new Date().getHours();
	const maxHora = dateRange?.start && dateRange?.end ? 23 : horaAtual;

	const mensagensPorHoraData = [];
	for (let h = 0; h <= maxHora; h++) {
		mensagensPorHoraData.push({
			hora: `${h.toString().padStart(2, "0")}:00`,
			mensagens: mensagensPorHora[h],
		});
	}

	// Últimos leads que receberam follow-up (sem duplicação)
	const ultimosFollowUps = [];
	const leadsProcessados = new Set(); // Para evitar duplicação

	leads.forEach((lead) => {
		// Encontrar o último follow-up enviado deste lead
		let ultimoFollowUp = null;
		let ultimaDataEnvio = null;

		for (let i = 1; i <= 14; i++) {
			const dataEnvioField = "data_envio" + i;

			if (lead[dataEnvioField]) {
				const dataEnvio = new Date(lead[dataEnvioField]);

				// Se há período selecionado, só mostrar os do período
				if (dateRange?.start && dateRange?.end) {
					if (
						!isWithinInterval(dataEnvio, {
							start: new Date(dateRange.start),
							end: new Date(dateRange.end),
						})
					) {
						continue; // Pula se não estiver no período
					}
				}

				if (!ultimaDataEnvio || dataEnvio > ultimaDataEnvio) {
					ultimaDataEnvio = dataEnvio;
					ultimoFollowUp = i;
				}
			}
		}

		// Verificar follow_up9B
		if (lead.data_envio9B) {
			const dataEnvio = new Date(lead.data_envio9B);

			// Se há período selecionado, verificar se está no período
			if (dateRange?.start && dateRange?.end) {
				if (
					isWithinInterval(dataEnvio, {
						start: new Date(dateRange.start),
						end: new Date(dateRange.end),
					})
				) {
					if (!ultimaDataEnvio || dataEnvio > ultimaDataEnvio) {
						ultimaDataEnvio = dataEnvio;
						ultimoFollowUp = "9B";
					}
				}
			} else {
				if (!ultimaDataEnvio || dataEnvio > ultimaDataEnvio) {
					ultimaDataEnvio = dataEnvio;
					ultimoFollowUp = "9B";
				}
			}
		}

		// Adicionar apenas o último follow-up de cada lead
		if (ultimoFollowUp && !leadsProcessados.has(lead.id || lead.telefone)) {
			ultimosFollowUps.push({
				nome: lead.nome || "Sem nome",
				telefone: lead.telefone || "Sem telefone",
				followUp: `Follow-up ${ultimoFollowUp}`,
				numeroFollowUp: ultimoFollowUp,
				dataEnvio: ultimaDataEnvio,
				situacao: lead.situacao || "Não especificado",
			});
			leadsProcessados.add(lead.id || lead.telefone);
		}
	});

	// Ordenar por data mais recente e pegar os 100 últimos
	const ultimosFollowUpsOrdenados = ultimosFollowUps
		.sort((a, b) => b.dataEnvio - a.dataEnvio)
		.slice(0, 100);

	// Leads com documentos aprovados (métrica positiva)
	const docsAprovados = leads.filter(
		(l) => l.status_doc === "aprovado" || l.docProcessado === "sim"
	).length;

	// Quantos leads estão em cada etapa do follow-up (SEMPRE TOTAL GERAL)
	const leadsPorEtapaFollowUp = {};

	// Para cada lead, descobrir qual é o último follow-up enviado (etapa atual)
	leads.forEach((lead) => {
		let ultimaEtapa = 0;
		let ultimaEtapaLabel = null;

		// Verificar do follow-up 1 ao 14
		for (let i = 1; i <= 14; i++) {
			const dataEnvioField = "data_envio" + i;
			if (lead[dataEnvioField] != null) {
				ultimaEtapa = i;
				ultimaEtapaLabel = `Follow-up ${i}`;
			}
		}

		// Verificar follow_up9B
		if (lead.data_envio9B != null) {
			const dataEnvio9B = new Date(lead.data_envio9B);
			const dataUltimaEtapa =
				ultimaEtapa > 0 ? new Date(lead[`data_envio${ultimaEtapa}`]) : null;

			// Se 9B é mais recente que a última etapa encontrada
			if (!dataUltimaEtapa || dataEnvio9B > dataUltimaEtapa) {
				ultimaEtapaLabel = "Follow-up 9B";
			}
		}

		// Se encontrou algum follow-up enviado, contar na etapa
		if (ultimaEtapaLabel) {
			leadsPorEtapaFollowUp[ultimaEtapaLabel] =
				(leadsPorEtapaFollowUp[ultimaEtapaLabel] || 0) + 1;
		} else {
			// Lead ainda não recebeu nenhum follow-up
			leadsPorEtapaFollowUp["Sem follow-up"] =
				(leadsPorEtapaFollowUp["Sem follow-up"] || 0) + 1;
		}
	});

	// Calcular dados do funil de conversão
	// Leads para abordar: leads que ainda não receberam nenhum follow-up
	const leadsParaAbordar = leads.filter((lead) => {
		let temEnvio = false;
		for (let i = 1; i <= 14; i++) {
			if (lead[`data_envio${i}`] != null) {
				temEnvio = true;
				break;
			}
		}
		if (lead.data_envio9B != null) {
			temEnvio = true;
		}
		return !temEnvio;
	}).length;

	// Leads abordados: leads que receberam pelo menos 1 mensagem
	const leadsAbordados = leads.filter((lead) => {
		let temEnvio = false;
		for (let i = 1; i <= 14; i++) {
			if (lead[`data_envio${i}`] != null) {
				temEnvio = true;
				break;
			}
		}
		if (lead.data_envio9B != null) {
			temEnvio = true;
		}
		return temEnvio;
	}).length;

	// Leads processados: campo ja_processado = "sim"
	const leadsProcessadosFunil = jaProcessados;

	// Documentos enviados: campo docProcessado = "sim"
	const documentosEnviados = docsProcessados;

	const funnelData = {
		paraAbordar: leadsParaAbordar,
		abordados: leadsAbordados,
		processados: leadsProcessadosFunil,
		documentosEnviados: documentosEnviados,
	};

	return {
		total,
		totalAtivos,
		totalInativos,
		porCanal,
		porSituacao,
		porEstadoCivil,
		porFilhosMenores,
		porPrimeiroFinanciamento,
		followUpStats,
		enviosPorDia,
		taxaConversao: parseFloat(taxaConversao),
		leadsPorHora,
		tendenciasDiarias,
		comparativoPeriodo,
		docsProcessados,
		docsNaoProcessados,
		jaProcessados,
		naoProcessados,
		totalMensagensEnviadas,
		mensagensEnviadasPeriodo, // Mensagens do período selecionado
		mensagensPorHoraData, // Dados reais por hora do banco
		ultimosFollowUps: ultimosFollowUpsOrdenados,
		docsAprovados,
		leadsPorEtapaFollowUp,
		funnelData,
	};
};

export const getDateRangePresets = () => {
	const today = new Date();

	return {
		hoje: {
			label: "Hoje",
			start: startOfDay(today),
			end: endOfDay(today),
		},
		ontem: {
			label: "Ontem",
			start: startOfDay(subDays(today, 1)),
			end: endOfDay(subDays(today, 1)),
		},
		ultimos7dias: {
			label: "Últimos 7 dias",
			start: startOfDay(subDays(today, 6)),
			end: endOfDay(today),
		},
		ultimos30dias: {
			label: "Últimos 30 dias",
			start: startOfDay(subDays(today, 29)),
			end: endOfDay(today),
		},
		estaSemana: {
			label: "Esta semana",
			start: startOfWeek(today, { locale: ptBR }),
			end: endOfWeek(today, { locale: ptBR }),
		},
		semanaPassada: {
			label: "Semana passada",
			start: startOfWeek(subWeeks(today, 1), { locale: ptBR }),
			end: endOfWeek(subWeeks(today, 1), { locale: ptBR }),
		},
		esteMes: {
			label: "Este mês",
			start: startOfMonth(today),
			end: endOfMonth(today),
		},
		mesPassado: {
			label: "Mês passado",
			start: startOfMonth(subMonths(today, 1)),
			end: endOfMonth(subMonths(today, 1)),
		},
		todos: {
			label: "Todos os períodos",
			start: null,
			end: null,
		},
	};
};
