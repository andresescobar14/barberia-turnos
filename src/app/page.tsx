'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../supabase';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';

const SERVICIOS = [
  { id: 'corte', nombre: 'Corte Ejecutivo', precio: '$250' },
  { id: 'barba', nombre: 'Perfilado de Barba', precio: '$180' },
  { id: 'combo', nombre: 'Corte + Barba + Toalla', precio: '$400' },
  { id: 'facial', nombre: 'Limpieza Facial Express', precio: '$200' },
  { id: 'premium', nombre: 'Tratamiento Royal VIP', precio: '$600' },
];

const TRABAJOS = [
  { id: 1, titulo: 'Fade Clásico', desc: 'Precisión milimétrica' },
  { id: 2, titulo: 'Barba Esculpida', desc: 'Líneas limpias e hidratación' },
  { id: 3, titulo: 'Estilo Urbano', desc: 'Tendencias modernas' },
];

type FormData = {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
};

const FORM_INICIAL: FormData = {
  nombre: '',
  telefono: '',
  servicio: '',
  fecha: '',
};

const inputClase =
  'w-full rounded-lg border border-sky-900 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30';

export default function Home() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [form, setForm] = useState<FormData>(FORM_INICIAL);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    const contexto = gsap.context(() => {
      gsap.from('.gsap-hero-title', {
        opacity: 0,
        y: -50,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from('.gsap-hero-btn', {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        delay: 0.5,
        ease: 'back.out(1.7)',
      });
    });

    return () => contexto.revert();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((actual) => ({
      ...actual,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cargando) return;

    if (!form.fecha) {
      alert('Por favor, selecciona una fecha y hora.');
      return;
    }

    const fechaSeleccionada = new Date(form.fecha);

    if (Number.isNaN(fechaSeleccionada.getTime())) {
      alert('La fecha seleccionada no es válida.');
      return;
    }

    if (fechaSeleccionada.getTime() <= Date.now()) {
      alert('Selecciona una fecha y hora futuras.');
      return;
    }

    setCargando(true);

    try {
      const { error } = await supabase.from('turnos').insert({
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        servicio: form.servicio,
        fecha: fechaSeleccionada.toISOString(),
      });

      if (error) throw error;

      setEnviado(true);
    } catch (error) {
      console.error('Error al guardar la reserva:', error);
      alert('Hubo un error al reservar. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setEnviado(false);

    setTimeout(() => {
      document
        .getElementById('reservas')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setEnviado(false);
    setForm(FORM_INICIAL);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-50 border-b border-sky-500/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400 text-lg text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              ✂
            </span>

            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold uppercase tracking-[0.2em] text-transparent sm:text-2xl">
              Cyber Barber
            </h1>
          </div>

          <nav className="hidden gap-8 text-xs uppercase tracking-widest text-slate-400 md:flex">
            <a href="#nosotros" className="transition hover:text-cyan-400">
              Nosotros
            </a>
            <a href="#servicios" className="transition hover:text-cyan-400">
              Servicios
            </a>
            <a href="#galeria" className="transition hover:text-cyan-400">
              Galería
            </a>
            <a href="#reservas" className="transition hover:text-cyan-400">
              Reservas
            </a>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[85vh] items-center justify-center px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15),transparent_60%)]" />

        <div className="relative z-10 max-w-3xl">
          <div className="gsap-hero-title">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.5em] text-cyan-400">
              Evolución & Estilo Urbano
            </p>

            <h2 className="text-4xl font-black leading-tight text-white sm:text-6xl">
              Cortes del futuro,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                diseñados hoy
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-md text-slate-400 sm:text-lg">
              Estética de alta gama bajo un entorno digital y vanguardista.
              Domina tu estilo con precisión milimétrica.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirFormulario}
            className="gsap-hero-btn group mt-10 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-105 hover:shadow-cyan-400/40 active:scale-95"
          >
            Reservar turno ahora
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </section>

      <section
        id="nosotros"
        className="mx-auto max-w-5xl border-t border-slate-900 px-6 py-20"
        data-aos="fade-up"
      >
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-cyan-400">
              Quiénes somos
            </p>

            <h3 className="mt-2 text-3xl font-bold text-white">
              Redefiniendo el concepto clásico
            </h3>

            <p className="mt-6 leading-relaxed text-slate-400">
              No somos una barbería tradicional. Fusionamos las técnicas
              clásicas de la vieja escuela con las últimas tendencias de diseño
              urbano y tecnología digital, ofreciéndote un servicio ágil y
              personalizado.
            </p>
          </div>

          <div
            className="relative flex h-64 flex-col justify-center rounded-2xl border border-sky-500/10 bg-gradient-to-br from-slate-900 to-sky-950 p-8 shadow-inner"
            data-aos="zoom-in"
          >
            <div className="mb-2 text-4xl font-black text-cyan-400">100%</div>

            <div className="font-bold uppercase tracking-wider text-white">
              Garantía de satisfacción
            </div>

            <div className="mt-2 text-sm text-slate-500">
              Cada trazado con la navaja y cada caída de tijera está respaldada
              por barberos certificados.
            </div>
          </div>
        </div>
      </section>

      <section
        id="servicios"
        className="mx-auto max-w-6xl border-t border-slate-900 px-6 py-20"
        data-aos="fade-up"
      >
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-cyan-400">
            Menú de opciones
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            Nuestros servicios
          </h3>

          <div className="mx-auto mt-4 h-0.5 w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((servicio) => (
            <div
              key={servicio.id}
              className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/40 p-6 transition duration-300 hover:border-cyan-500/30 hover:bg-slate-900/80 hover:shadow-[0_0_20px_rgba(6,182,212,0.05)]"
              data-aos="fade-up"
            >
              <span className="font-semibold text-slate-200">
                {servicio.nombre}
              </span>

              <span className="rounded-lg border border-cyan-500/20 bg-cyan-950/60 px-3 py-1 font-bold text-cyan-400">
                {servicio.precio}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        id="galeria"
        className="mx-auto max-w-6xl border-t border-slate-900 px-6 py-20"
        data-aos="fade-up"
      >
        <div className="mb-12 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-cyan-400">
            Portafolio visual
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            Nuestro trabajo
          </h3>

          <div className="mx-auto mt-4 h-0.5 w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRABAJOS.map((trabajo) => (
            <div
              key={trabajo.id}
              className="group relative overflow-hidden rounded-xl border border-slate-900 bg-slate-900/20 p-8 transition duration-300 hover:border-cyan-500/20"
              data-aos="zoom-in"
            >
              <div className="mb-4 font-mono text-2xl text-cyan-500/40">
                0{trabajo.id}
              </div>

              <h4 className="text-xl font-bold text-white">
                {trabajo.titulo}
              </h4>

              <p className="mt-2 text-sm text-slate-400">{trabajo.desc}</p>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </section>

      <section
        id="reservas"
        className="border-t border-slate-900 px-6 py-20"
        data-aos="fade-up"
      >
        <div
          className={`mx-auto max-w-xl overflow-hidden transition-all duration-700 ease-out ${
            mostrarFormulario
              ? 'max-h-[1100px] translate-y-0 opacity-100'
              : 'pointer-events-none max-h-0 translate-y-10 opacity-0'
          }`}
        >
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Reserva tu espacio
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Selecciona tu horario y asegura tu lugar.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarFormulario}
                aria-label="Cerrar formulario"
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-800 hover:text-cyan-400"
              >
                ✕
              </button>
            </div>

            {enviado ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-400 text-3xl text-cyan-400">
                  ✓
                </div>

                <h4 className="text-xl font-bold text-white">
                  ¡Reserva guardada con éxito!
                </h4>

                <p className="mt-3 text-slate-400">
                  Gracias, {form.nombre}. Tu reserva se ha guardado correctamente.
                </p>

                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="mt-6 rounded-xl border border-cyan-400 px-6 py-3 text-sm font-bold uppercase tracking-widest text-cyan-400 transition hover:bg-cyan-400 hover:text-slate-950"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    className={inputClase}
                    placeholder="Escribe tu nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={25}
                    className={inputClase}
                    placeholder="Ej: +52 55 1234 5678"
                    value={form.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="servicio"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
                  >
                    Servicio
                  </label>

                  <select
                    id="servicio"
                    name="servicio"
                    required
                    className={inputClase}
                    value={form.servicio}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona un servicio</option>

                    {SERVICIOS.map((servicio) => (
                      <option key={servicio.id} value={servicio.nombre}>
                        {servicio.nombre} — {servicio.precio}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="fecha"
                    className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400"
                  >
                    Fecha y hora
                  </label>

                  <input
                    id="fecha"
                    name="fecha"
                    type="datetime-local"
                    required
                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16)}
                    className={inputClase}
                    value={form.fecha}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cargando ? 'Sincronizando...' : 'Confirmar turno'}
                </button>
              </form>
            )}
          </div>
        </div>

        {!mostrarFormulario && (
          <div className="text-center">
            <button
              type="button"
              onClick={abrirFormulario}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 hover:shadow-cyan-400/40 active:scale-95"
            >
              Reservar mi turno
            </button>
          </div>
        )}
      </section>

      <footer className="border-t border-slate-900 px-6 py-8 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-500">
          © {new Date().getFullYear()} Cyber Barber. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}