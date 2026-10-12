'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { supabase } from '../supabase';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { gsap } from 'gsap';
import Head from 'next/head';

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

type FormularioReserva = {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
};

export default function Home() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const [form, setForm] = useState<FormularioReserva>({
    nombre: '',
    telefono: '',
    servicio: '',
    fecha: '',
  });

  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);

    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
      disable: 'mobile',
    });

    gsap.from('.gsap-hero-title', {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.from('.gsap-hero-btn', {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      delay: 0.4,
      ease: 'power2.out',
    });
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.telefono.trim() || !form.servicio) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (!form.fecha) {
      alert('Por favor, selecciona una fecha y hora.');
      return;
    }

    const fechaSeleccionada = new Date(form.fecha);

    if (Number.isNaN(fechaSeleccionada.getTime())) {
      alert('La fecha seleccionada no es válida.');
      return;
    }

    if (fechaSeleccionada.getTime() < Date.now()) {
      alert('Selecciona una fecha y hora futuras.');
      return;
    }

    setCargando(true);

    try {
      const { error } = await supabase.from('turnos').insert([
        {
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          servicio: form.servicio,
          fecha: fechaSeleccionada.toISOString(),
        },
      ]);

      if (error) {
        throw error;
      }

      setEnviado(true);
    } catch (error) {
      console.error('Error al guardar turno:', error);
      alert('Hubo un error al reservar. Inténtalo nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const abrirFormulario = () => {
    setMostrarFormulario(true);
    setEnviado(false);

    setTimeout(() => {
      document.getElementById('reservas')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const inputClase =
    'w-full rounded-lg border border-sky-900 bg-slate-900/80 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition duration-150 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30';

  if (!montado) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <main className="min-h-screen overflow-x-hidden scroll-smooth bg-slate-950 text-slate-200">
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <title>Cyber Barber | Reserva tu turno</title>
        <meta
          name="description"
          content="Reserva tu turno en Cyber Barber y descubre nuestros servicios de barbería."
        />
      </Head>

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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12),transparent_60%)]" />

        <div className="relative z-10 max-w-3xl">
          <div className="gsap-hero-title">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.5em] text-cyan-400">
              Evolución &amp; Estilo Urbano
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
            className="gsap-hero-btn group mt-10 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20 transition duration-200 hover:scale-105 hover:shadow-cyan-400/40 active:scale-95"
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
              Quiénes Somos
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
              Garantía de Satisfacción
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
            Menú de Opciones
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            Nuestros Servicios
          </h3>

          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICIOS.map((servicio) => (
            <div
              key={servicio.id}
              className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/40 p-6 transition duration-200 hover:border-cyan-500/30 hover:bg-slate-900/80"
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
            Portafolio Visual
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            Nuestro Trabajo
          </h3>

          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRABAJOS.map((trabajo) => (
            <div
              key={trabajo.id}
              className="group relative overflow-hidden rounded-xl border border-slate-900 bg-slate-900/20 p-8 transition duration-200 hover:border-cyan-500/20"
              data-aos="zoom-in"
            >
              <div className="mb-4 font-mono text-2xl text-cyan-500/40">
                0{trabajo.id}
              </div>

              <h4 className="text-xl font-bold text-white">
                {trabajo.titulo}
              </h4>

              <p className="mt-2 text-sm text-slate-400">{trabajo.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="reservas"
        className="scroll-mt-24 border-t border-slate-900 px-6 py-20"
      >
        <div
          className={`mx-auto max-w-xl transition-all duration-500 ease-in-out ${
            mostrarFormulario
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-80'
          }`}
        >
          <div className="mb-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-cyan-400">
              Agenda Digital
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white">
              Reserva tu espacio
            </h3>

            <p className="mt-4 text-slate-400">
              Selecciona tu horario y asegura tu lugar en nuestra base de datos.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-slate-900/50 p-6 shadow-xl shadow-cyan-950/20 sm:p-8">
            {enviado ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-3xl text-cyan-400">
                  ✓
                </div>

                <h4 className="text-2xl font-bold text-white">
                  ¡Reserva guardada con éxito!
                </h4>

                <p className="mt-4 text-slate-400">
                  Gracias, {form.nombre}. Tu reserva se ha guardado en Supabase.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      nombre: '',
                      telefono: '',
                      servicio: '',
                      fecha: '',
                    });
                    setEnviado(false);
                  }}
                  className="mt-8 rounded-xl border border-cyan-500/30 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/10"
                >
                  Hacer otra reserva
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Nombre completo
                  </label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Escribe tu nombre"
                    className={inputClase}
                    autoComplete="name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Tu número de teléfono"
                    className={inputClase}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="servicio"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Servicio
                  </label>

                  <select
                    id="servicio"
                    name="servicio"
                    value={form.servicio}
                    onChange={handleChange}
                    className={inputClase}
                    required
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
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Fecha y hora
                  </label>

                  <input
                    id="fecha"
                    name="fecha"
                    type="datetime-local"
                    value={form.fecha}
                    onChange={handleChange}
                    min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16)}
                    className={inputClase}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02] hover:shadow-cyan-400/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cargando ? 'Sincronizando...' : 'Confirmar Turno'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 px-6 py-8 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Cyber Barber. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}