import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import moment from 'moment';

export default function PDFExporter({ client, stageData, latestStageData }) {
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    try {
      const pdf = new jsPDF();
      let y = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;

      // Helper para adicionar nova página
      const checkNewPage = (neededSpace = 20) => {
        if (y + neededSpace > pageHeight - margin) {
          pdf.addPage();
          y = 20;
          return true;
        }
        return false;
      };

      // Título
      pdf.setFontSize(22);
      pdf.setTextColor(124, 58, 237); // purple-600
      pdf.text('Relatório de Performance', margin, y);
      y += 12;

      // Nome do Cliente
      pdf.setFontSize(16);
      pdf.setTextColor(30, 41, 59); // slate-800
      pdf.text(client.name, margin, y);
      y += 8;

      // Data
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139); // slate-500
      pdf.text(`Gerado em: ${moment().format('DD/MM/YYYY HH:mm')}`, margin, y);
      y += 15;

      // Linha separadora
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y, 190, y);
      y += 10;

      // Informações Gerais
      checkNewPage(40);
      pdf.setFontSize(14);
      pdf.setTextColor(51, 65, 85); // slate-700
      pdf.text('Informações Gerais', margin, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      if (client.responsible) {
        pdf.text(`Responsável: ${client.responsible}`, margin, y);
        y += 6;
      }
      if (client.sector) {
        pdf.text(`Setor: ${client.sector}`, margin, y);
        y += 6;
      }
      pdf.text(`Etapa Atual: ${client.current_stage}`, margin, y);
      y += 6;
      pdf.text(`Status: ${client.status === 'saudavel' ? 'Saudável' : client.status === 'atencao' ? 'Atenção' : 'Crítico'}`, margin, y);
      y += 15;

      // Métricas por Etapa
      const stages = [2, 3, 4, 5, 6];
      const stageNames = {
        2: 'Geração de Demanda',
        3: 'Lead Qualificado (MQL)',
        4: 'Conversão de Página',
        5: 'Indicadores de Vendas',
        6: 'Validação'
      };

      for (const stage of stages) {
        const data = latestStageData[stage];
        if (!data) continue;

        checkNewPage(50);
        
        // Título da Etapa
        pdf.setFontSize(14);
        pdf.setTextColor(124, 58, 237);
        pdf.text(`Etapa ${stage}: ${stageNames[stage]}`, margin, y);
        y += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        pdf.text(`Mês de referência: ${moment(data.month).format('MMM/YYYY')}`, margin, y);
        y += 8;

        // Métricas específicas por etapa
        if (stage === 2) {
          if (data.investment_ads) {
            pdf.text(`Investimento: R$ ${data.investment_ads.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, margin, y);
            y += 6;
          }
          if (data.leads_whatsapp) {
            pdf.text(`Leads WhatsApp: ${data.leads_whatsapp}`, margin, y);
            y += 6;
          }
          if (data.cpl_client) {
            pdf.text(`CPL: R$ ${data.cpl_client.toFixed(2)}`, margin, y);
            y += 6;
          }
          if (data.reach) {
            pdf.text(`Alcance: ${data.reach.toLocaleString()}`, margin, y);
            y += 6;
          }
          if (data.frequency) {
            pdf.text(`Frequência: ${data.frequency.toFixed(1)}x`, margin, y);
            y += 6;
          }
        }

        if (stage === 3) {
          if (data.mql_quantity) {
            pdf.text(`MQLs: ${data.mql_quantity}`, margin, y);
            y += 6;
          }
          if (data.mql_cost) {
            pdf.text(`Custo por MQL: R$ ${data.mql_cost.toFixed(2)}`, margin, y);
            y += 6;
          }
        }

        if (stage === 4) {
          if (data.conversion_lp_base) {
            pdf.text(`Conversão LP Base: ${data.conversion_lp_base.toFixed(1)}%`, margin, y);
            y += 6;
          }
          if (data.conversion_lp_a) {
            pdf.text(`Conversão LP A: ${data.conversion_lp_a.toFixed(1)}%`, margin, y);
            y += 6;
          }
          if (data.conversion_lp_b) {
            pdf.text(`Conversão LP B: ${data.conversion_lp_b.toFixed(1)}%`, margin, y);
            y += 6;
          }
        }

        if (stage === 5) {
          if (data.sales_count) {
            pdf.text(`Vendas: ${data.sales_count}`, margin, y);
            y += 6;
          }
          if (data.revenue) {
            pdf.text(`Receita: R$ ${data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, margin, y);
            y += 6;
          }
          if (data.cac) {
            pdf.text(`CAC: R$ ${data.cac.toFixed(2)}`, margin, y);
            y += 6;
          }
          if (data.roas) {
            pdf.text(`ROAS: ${data.roas.toFixed(1)}x`, margin, y);
            y += 6;
          }
        }

        y += 10;
      }

      // Histórico Resumido
      checkNewPage(50);
      pdf.setFontSize(14);
      pdf.setTextColor(124, 58, 237);
      pdf.text('Histórico de Dados', margin, y);
      y += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(71, 85, 105);
      const totalRecords = stageData.length;
      pdf.text(`Total de registros: ${totalRecords}`, margin, y);
      y += 6;

      const uniqueMonths = [...new Set(stageData.map(d => d.month))].length;
      pdf.text(`Meses de dados: ${uniqueMonths}`, margin, y);
      y += 15;

      // Rodapé
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(
          `Página ${i} de ${pageCount} - Sistema de Aquisição Base Tech`,
          margin,
          pageHeight - 10
        );
      }

      return pdf;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  const downloadPDF = async () => {
    setExporting(true);
    try {
      const pdf = await exportPDF();
      pdf.save(`relatorio-${client.name.toLowerCase().replace(/\s+/g, '-')}-${moment().format('YYYY-MM-DD')}.pdf`);
    } catch (error) {
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button 
      onClick={downloadPDF}
      disabled={exporting}
      variant="outline"
      className="border-purple-300 text-purple-700 hover:bg-purple-50"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório PDF
        </>
      )}
    </Button>
  );
}
