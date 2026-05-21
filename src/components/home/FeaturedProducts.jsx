import React from "react";
import { Link } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";

export default function FeaturedProducts() {
  const products = [
    {
      title: "Raspberry Pi 2 Model B",
      description: "8GB RAM, Broadcom BCM2711, Quad core Cortex-A72",
      img: "https://images.unsplash.com/photo-1552283576-3ea3519bf12e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJhc3BiZXJyeSUyMHBpfGVufDB8fDB8fHww",
    },
    {
      title: "Arduino Uno R3",
      description: "ATmega328P microcontroller based board",
      img: "https://images.unsplash.com/photo-1553406830-ef2513450d76?q=80&w=800",
    },
    {
      title: "IoT Starter Kit",
      description: "Complete kit with NodeMCU, sensors, and components",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800",
    },
    {
      title: "Robotics Chassis Kit",
      description: "4-wheel drive aluminum chassis with motors",
      img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-xs font-black text-cyan-600 uppercase tracking-[0.3em] mb-4">
              Hardware & Kits
            </h2>
            <h3 className="text-4xl font-black text-[#0f2c59] tracking-tighter leading-tight">
              Build with the <span className="text-gray-400 italic">Best</span>{" "}
              Equipment
            </h3>
          </div>
        </div>

        {/* Dense Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <div
              key={i}
              className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Content Area */}
              <div className="p-6 flex-grow flex flex-col">
                <h4 className="text-lg font-bold text-[#0f2c59] mb-2 leading-tight group-hover:text-cyan-600 transition-colors line-clamp-2">
                  {p.title}
                </h4>

                <p className="text-xs text-gray-500 mb-6 flex-grow">
                  {p.description}
                </p>

                {/* Footer of the Card */}
                <div className="pt-4 border-t border-gray-50 mt-auto flex justify-end">
                  <button className="w-10 h-10 flex items-center justify-center bg-cyan-50 text-cyan-600 rounded-xl hover:bg-cyan-500 hover:text-white transition-all">
                    <LuShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Products Button */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2 bg-[#0f2c59] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-xl shadow-[#0f2c59]/20 hover:bg-cyan-700 transition-all hover:-translate-y-1"
          >
            Explore Products
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
