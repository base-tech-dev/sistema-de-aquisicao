import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, Minus, Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HistoryTable({ data, stage, onEdit }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl p-8 text-center">
        <p className="text-slate-500 text-sm">Nenhum histórico disponível para esta etapa.</p>
      </div>
    );
  }

  const getMetricColumns = () => {
    switch (stage) {
      case 2:
        return [
          { key: 'cpl_client', label: 'CPL Cliente', prefix: 'R$ ' },
          { key: 'cpl_market', label: 'CPL Mercado', prefix: 'R$ ' },
          { key: 'leads_whatsapp', label: 'Leads' },
          { key: 'frequency', label: 'Frequência', suffix: 'x' },
        ];
      case 3:
        return [
          { key: 'mql_quantity', label: 'MQL' },
          { key: 'mql_cost', label: 'Custo MQL', prefix: 'R$ ' },
        ];
      case 4:
        return [
          { key: 'conversion_lp_base', label: 'LP Base', suffix: '%' },
          { key: 'conversion_lp_a', label: 'LP A', suffix: '%' },
          { key: 'conversion_lp_b', label: 'LP B', suffix: '%' },
        ];
      case 5:
        return [
          { key: 'cac', label: 'CAC', prefix: 'R$ ' },
          { key: 'roas', label: 'ROAS', suffix: 'x' },
          { key: 'mql_quantity', label: 'MQL' },
          { key: 'funnel_conversion', label: 'Conversão', suffix: '%' },
        ];
      default:
        return [];
    }
  };

  const columns = getMetricColumns();

  const getStatus = (row, index) => {
    if (stage === 2) {
      return row.cpl_client <= row.cpl_market;
    }
    if (stage === 3) {
      const meta = (row.cpl_market || 10) * 4;
      return row.mql_cost <= meta;
    }
    if (stage === 4 && index > 0) {
      const prev = data[index - 1];
      const best = Math.max(row.conversion_lp_base || 0, row.conversion_lp_a || 0, row.conversion_lp_b || 0);
      const prevBest = Math.max(prev.conversion_lp_base || 0, prev.conversion_lp_a || 0, prev.conversion_lp_b || 0);
      return best > prevBest;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Mês</TableHead>
            {columns.map(col => (
              <TableHead key={col.key} className="font-semibold">{col.label}</TableHead>
            ))}
            <TableHead className="font-semibold text-center">Status</TableHead>
            <TableHead className="font-semibold text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const status = getStatus(row, index);
            return (
              <TableRow key={row.id || index} className="hover:bg-slate-50">
                <TableCell className="font-medium">{row.month}</TableCell>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {col.prefix}{row[col.key]?.toLocaleString('pt-BR') || '-'}{col.suffix}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {status === true && <CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />}
                  {status === false && <XCircle className="w-5 h-5 text-red-500 inline" />}
                  {status === null && <Minus className="w-5 h-5 text-slate-300 inline" />}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(row)}
                    className="hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
