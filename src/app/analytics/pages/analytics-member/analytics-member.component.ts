import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberMetricsService } from '../../services/member-metrics.service';
import { MemberTask } from '../../models/member-task.entity';
import { MemberStatistics } from '../../models/member-statistics.entity';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../iam/services/auth.service'; // importa el servicio de autenticación

@Component({
  selector: 'app-analytics-member',
  templateUrl: './analytics-member.component.html',
  styleUrls: ['./analytics-member.component.css'],
  imports: [CommonModule]
})
export class AnalyticsMemberComponent implements OnInit {
  loading = true;
  errorMsg = '';
  memberId: number = 0;
  memberName = '';
  username = '';
  profileImageUrl = '';
  email = '';
  overview: Partial<MemberStatistics> = {};
  memberTasks: MemberTask[] = [];
  rescheduled = { rescheduled: 0, notRescheduled: 0 };
  avgCompletion = { avgDays: 0 };

  constructor(
    private metricsService: MemberMetricsService,
    private http: HttpClient,
    private authService: AuthService // inyecta el servicio de autenticación
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token') || '';
    this.loading = true;

    if (!token) {
      console.warn('[AnalyticsMember] No se encontró token en localStorage. El usuario podría no estar autenticado.');
      this.loading = false;
      this.errorMsg = `No se encontró token de autenticación. Por favor inicia sesión nuevamente.`;
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any>(`/api/v1/member/details`, { headers, observe: 'response' }).subscribe({
      next: (response) => {
        // Depuración: muestra el status y el contenido recibido SIEMPRE
        console.log('[AnalyticsMember] Response status:', response.status, response.statusText);
        console.log('[AnalyticsMember] Response body:', response.body);

        if (response.status !== 200 && response.status !== 201) {
          this.loading = false;
          this.errorMsg = `El backend respondió con status ${response.status} (${response.statusText}). Debe responder 200/201 y JSON. Verifica el backend y el proxy.`;
          return;
        }
        const member = response.body;

        // Detecta si la respuesta es un objeto con propiedad 'text' que contiene HTML
        if (member && typeof member.text === 'string' && member.text.trim().startsWith('<!doctype html')) {
          this.loading = false;
          this.errorMsg = `El backend devolvió HTML en vez de JSON.
Esto suele indicar que el endpoint '/api/v1/member/details' no existe o el proxy no está configurado correctamente.
Verifica que el backend esté corriendo y que el proxy redirija '/api' al backend.
Contenido recibido:\n${member.text.substring(0, 500)}...`;
          console.error('[AnalyticsMember] Respuesta tipo HTML (body.text):', member.text);
          return;
        }

        // Si la respuesta es una cadena (probablemente HTML), muéstrala
        if (typeof member === 'string' && member.trim().startsWith('<!doctype html')) {
          this.loading = false;
          this.errorMsg = `El backend devolvió HTML en vez de JSON.
Esto suele indicar que el endpoint '/api/v1/member/details' no existe o el proxy no está configurado correctamente.
Verifica que el backend esté corriendo y que el proxy redirija '/api' al backend.
Contenido recibido:\n${member.substring(0, 500)}...`;
          console.error('[AnalyticsMember] Respuesta tipo HTML (string):', member);
          return;
        }

        if (typeof member === 'string') {
          this.loading = false;
          this.errorMsg = `El backend devolvió una cadena en vez de JSON. Contenido recibido:\n${member.substring(0, 500)}...`;
          console.error('[AnalyticsMember] Respuesta tipo string:', member);
          return;
        }
        // Si no hay datos válidos, muestra el contenido recibido
        if (!member || !member.id) {
          this.loading = false;
          this.errorMsg = `La respuesta del backend no contiene datos válidos de miembro. Respuesta: ${JSON.stringify(member)}`;
          console.error('[AnalyticsMember] Respuesta inválida:', member);
          return;
        }
        // Asigna los datos del miembro
        this.memberId = member.id;
        this.memberName = `${member.name} ${member.surname}`;
        this.username = member.username;
        this.profileImageUrl = member.imgUrl || '';
        this.email = member.email || '';
        // Carga métricas y tareas
        this.loadMetrics(token, this.memberId);
        this.loadTasks(token, this.memberId);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('[AnalyticsMember] Error response:', err);

        // Detecta si la respuesta es HTML (probable error de proxy/backend)
        if (
          err.status === 200 &&
          err.error &&
          typeof err.error.text === 'string' &&
          err.error.text.trim().startsWith('<!doctype html')
        ) {
          this.errorMsg = `El backend devolvió HTML en vez de JSON.
Esto suele indicar que el endpoint '/api/v1/member/details' no existe o el proxy no está configurado correctamente.
Verifica que el backend esté corriendo en el puerto correcto y que el proxy.conf.json esté configurado así:
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
Si el problema persiste, consulta con el administrador del sistema.
Contenido recibido:\n${err.error.text.substring(0, 500)}...`;
          console.warn('[AnalyticsMember] Verifica que el backend esté corriendo en el puerto correcto y que el proxy.conf.json esté configurado. Ejemplo de proxy.conf.json:');
          console.warn(`{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}`);
          console.warn('Si usas Vite, revisa que la configuración de proxy sea equivalente.');
        } else if (err.status === 200 && typeof err.error === 'string' && err.error.trim().startsWith('<!doctype html')) {
          this.errorMsg = `El backend devolvió HTML en vez de JSON.
Esto suele indicar que el endpoint '/api/v1/member/details' no existe o el proxy no está configurado correctamente.
Verifica que el backend esté corriendo en el puerto correcto y que el proxy.conf.json esté configurado así:
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
Si el problema persiste, consulta con el administrador del sistema.
Contenido recibido:\n${err.error.substring(0, 500)}...`;
          console.warn('[AnalyticsMember] Verifica que el backend esté corriendo en el puerto correcto y que el proxy.conf.json esté configurado. Ejemplo de proxy.conf.json:');
          console.warn(`{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}`);
          console.warn('Si usas Vite, revisa que la configuración de proxy sea equivalente.');
        } else if (err.status === 401 || err.status === 403) {
          // Solo cierra sesión si el backend responde explícitamente que el token es inválido
          this.errorMsg = `Tu sesión ha expirado o el token es inválido. Por favor inicia sesión nuevamente.`;
          setTimeout(() => this.authService.signOut(), 2000);
        } else if (err.status === 200 && typeof err.error === 'string') {
          this.errorMsg = `El backend devolvió una cadena en vez de JSON. Contenido recibido:\n${err.error.substring(0, 500)}...`;
          console.error('[AnalyticsMember] Respuesta tipo string (error):', err.error);
        } else {
          this.errorMsg = `No se pudo cargar los datos del miembro autenticado. Código: ${err.status || 'desconocido'} - ${err.statusText || ''}`;
          if (err.error) {
            this.errorMsg += `\nContenido recibido: ${JSON.stringify(err.error)}`;
            console.error('[AnalyticsMember] Error body:', err.error);
          }
        }
      }
    });
  }

  loadTasks(token: string, memberId: number) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<MemberTask[]>(`/api/v1/members/${memberId}/tasks`, { headers }).subscribe({
      next: (tasks: MemberTask[]) => {
        this.memberTasks = tasks;
      },
      error: () => {
        // Solo muestra error en la sección de tareas
        this.memberTasks = [];
      }
    });
  }

  loadMetrics(token: string, memberId: number) {
    this.metricsService.getTaskOverview(memberId, token).subscribe({
      next: (overview: any) => {
        this.overview = {
          completed: overview.details?.COMPLETED ?? 0,
          done: overview.details?.DONE ?? 0,
          inProgress: overview.details?.IN_PROGRESS ?? 0,
          pending: overview.details?.PENDING ?? 0,
          overdue: overview.details?.OVERDUE ?? 0
        };
      },
      error: () => {
        this.overview = {};
      }
    });

    this.metricsService.getRescheduledTasks(memberId, token).subscribe({
      next: (rescheduled: any) => {
        this.rescheduled = {
          rescheduled: rescheduled.details?.rescheduled ?? 0,
          notRescheduled: rescheduled.details?.notRescheduled ?? 0
        };
      },
      error: () => {
        this.rescheduled = { rescheduled: 0, notRescheduled: 0 };
      }
    });

    this.metricsService.getAvgCompletionTime(memberId, token).subscribe({
      next: (avg: any) => {
        this.avgCompletion = { avgDays: avg.value ?? 0 };
      },
      error: () => {
        this.avgCompletion = { avgDays: 0 };
      }
    });
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

  trackByTask(index: number, task: MemberTask): number {
    return task.id;
  }
}
