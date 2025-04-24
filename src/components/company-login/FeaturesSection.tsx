import React from "react";
import { Building2, Users, Search } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="group bg-white p-6 rounded-2xl border border-sky-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start space-x-4">
            <div className="bg-sky-100 p-3 rounded-xl group-hover:bg-sky-600 transition-colors">
              <Building2 className="h-6 w-6 text-sky-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-sky-900">
                Dashboard Perusahaan Premium
              </h3>
              <p className="text-sky-700">
                Kelola lowongan dan kandidat dengan fitur yang lengkap
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-2xl border border-sky-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start space-x-4">
            <div className="bg-sky-100 p-3 rounded-xl group-hover:bg-sky-600 transition-colors">
              <Search className="h-6 w-6 text-sky-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-sky-900">
                Pencarian Kandidat Canggih
              </h3>
              <p className="text-sky-700">
                Temukan talenta terbaik dengan melihat profil dari kandidat yang
                sesuai kriteria perusahaan
              </p>
            </div>
          </div>
        </div>

        <div className="group bg-white p-6 rounded-2xl border border-sky-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-start space-x-4">
            <div className="bg-sky-100 p-3 rounded-xl group-hover:bg-sky-600 transition-colors">
              <Users className="h-6 w-6 text-sky-600 group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-sky-900">
                Manajemen Kandidat
              </h3>
              <p className="text-sky-700">
                Kelola kandidat dengan mudah dan akses ke database talenta
                terverifikasi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
