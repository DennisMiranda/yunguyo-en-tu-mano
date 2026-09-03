export default function FormularioEmprendimiento() {
  return (
    <section className="bg-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Tienes un emprendimiento?
        </h2>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
          Completa el formulario para considerar tu emprendimiento en nuestra página web
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScsKD2WXmRkZE25EKfETgrp3zv_JlM6cLnC1ZXgQJT7PkxL3Q/viewform?usp=publish-editor"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Completar formulario
        </a>
      </div>
    </section>
  );
}