import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { getDateRangePresets } from '../utils/metricsCalculator';

export const DateRangeFilter = ({ onRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('todos');

  const presets = getDateRangePresets();

  const handlePresetClick = (presetKey) => {
    setSelectedPreset(presetKey);
    const preset = presets[presetKey];
    onRangeChange(preset);
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    if (customStart && customEnd) {
      onRangeChange({
        label: 'Período personalizado',
        start: new Date(customStart),
        end: new Date(customEnd)
      });
      setSelectedPreset('custom');
      setIsOpen(false);
    }
  };

  const getCurrentLabel = () => {
    if (selectedPreset === 'custom') {
      return 'Período personalizado';
    }
    return presets[selectedPreset]?.label || 'Todos os períodos';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{getCurrentLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 z-20 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-900">Selecionar Período</h3>
            </div>

            <div className="p-3 space-y-1">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handlePresetClick(key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPreset === key 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <h4 className="text-xs font-medium text-gray-900 mb-3">Período Personalizado</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Data Início</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Data Fim</label>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCustomRange}
                  disabled={!customStart || !customEnd}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
