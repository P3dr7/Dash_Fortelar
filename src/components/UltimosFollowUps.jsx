import React, { useState, useMemo } from 'react';
import { Send, Clock, User, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EmptyState = () => (
  <div className="bg-white rounded-xl border border-gray-100 p-6">
    <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
      <Send className="w-5 h-5 text-blue-500" />
      Mensagens Enviadas
    </h3>
    <div className="text-center py-8 text-gray-400 text-sm">
      Nenhuma mensagem enviada ainda
    </div>
  </div>
);

const PaginationButton = ({ onClick, disabled, children, active = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-500 text-white'
        : 'border border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
    }`}
  >
    {children}
  </button>
);

const TableRow = ({ item }) => {
  // Garantir que temos dados válidos antes de renderizar
  if (!item || !item.dataEnvio) return null;

  const dataEnvioValida = new Date(item.dataEnvio);
  if (isNaN(dataEnvioValida.getTime())) return null;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-900">{item.nome}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Phone className="w-3 h-3" />
          {item.telefone}
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          {item.followUp}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock className="w-3 h-3" />
          {format(dataEnvioValida, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          item.situacao === 'ativo' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {item.situacao}
        </span>
      </td>
    </tr>
  );
};

export const UltimosFollowUps = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtrar dados válidos (apenas com dataEnvio válida)
  const validData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => item.dataEnvio && !isNaN(new Date(item.dataEnvio).getTime()));
  }, [data]);

  const paginationData = useMemo(() => {
    const totalItems = validData?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = validData?.slice(startIndex, endIndex) || [];

    return { totalItems, totalPages, startIndex, endIndex, currentData };
  }, [validData, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const { totalPages } = paginationData;
    const maxVisiblePages = 5;
    
    let startPage, endPage;
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= 3) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pageNum => (
      <PaginationButton
        key={pageNum}
        onClick={() => setCurrentPage(pageNum)}
        active={currentPage === pageNum}
      >
        {pageNum}
      </PaginationButton>
    ));
  };

  if (!data || data.length === 0 || validData.length === 0) {
    return <EmptyState />;
  }

  const { totalItems, totalPages, startIndex, endIndex, currentData } = paginationData;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-500" />
            Mensagens Enviadas
          </h3>
          <p className="text-xs text-gray-500 mt-1">Histórico de envios de follow-ups</p>
        </div>

        {/* Seletor de itens por página */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Mostrar:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-xs text-gray-600">por página</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Lead</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Telefone</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Follow-up</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Situação</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <TableRow key={`${item.telefone}-${index}`} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginação */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="text-sm text-gray-600">
          Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
          <span className="font-medium">{Math.min(endIndex, totalItems)}</span> de{' '}
          <span className="font-medium">{totalItems}</span> registros
        </div>

        <div className="flex items-center gap-2">
          <PaginationButton
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </PaginationButton>

          <div className="flex items-center gap-1">
            {renderPageNumbers()}
          </div>

          <PaginationButton
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </PaginationButton>
        </div>
      </div>
    </div>
  );
};
