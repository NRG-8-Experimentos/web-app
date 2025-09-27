import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-member',
  templateUrl: './analytics-member.component.html',
  styleUrls: ['./analytics-member.component.css'],
  imports: [CommonModule]
})
export class AnalyticsMemberComponent implements OnInit {
  loading = false;
  errorMsg = '';
  memberName = 'Ana Pérez';
  username = '@anaperez';
  profileImageUrl = 'https://randomuser.me/api/portraits/women/1.jpg';

  overview = {
    completed: 7,
    done: 2,
    inProgress: 2,
    pending: 1,
    overdue: 0
  };

  memberTasks = [
    { title: 'Revisar reporte mensual' },
    { title: 'Actualizar inventario' },
    { title: 'Coordinar reunión de equipo' },
    { title: 'Enviar informe de ventas' },
    { title: 'Preparar presentación' },
    { title: 'Revisar solicitudes de clientes' },
    { title: 'Planificar capacitación' },
    { title: 'Actualizar base de datos' },
    { title: 'Supervisar entregas' },
    { title: 'Organizar archivos' },
    { title: 'Responder correos pendientes' },
    { title: 'Evaluar desempeño del equipo' }
  ];

  rescheduled = {
    rescheduled: 2,
    notRescheduled: 10
  };

  avgCompletion = {
    avgDays: 1.7
  };

  ngOnInit(): void {
    // Simulación de datos, no se conecta a endpoints
  }

  formatAvgCompletionTime(avgDays: number): string {
    const totalMinutes = Math.round(avgDays * 24 * 60);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} día${days === 1 ? '' : 's'}`);
    if (hours > 0) parts.push(`${hours} hora${hours === 1 ? '' : 's'}`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes} minuto${minutes === 1 ? '' : 's'}`);
    return parts.join(', ');
  }

  trackByTask(index: number, task: any): string {
    // Usa el título como clave única para evitar NG0955
    return task.title;
  }
}
