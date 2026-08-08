import React, { useState } from 'react';
import { Calendar, User, MapPin, Briefcase, GraduationCap, IndianRupee, Info, Sparkles, HelpCircle } from 'lucide-react';
import { translations } from '../data/translations';

export default function ProfileInput({ profile, setProfile, onSubmit, language }) {
  const t = translations[language] || translations.EN;
  const [activeTooltip, setActiveTooltip] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-12 px-4">
      {/* Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-secondary text-white p-6 md:p-8 shadow-lg mb-8">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            {t.tellUsAbout}
          </h1>
          <p className="text-slate-200 text-sm md:text-base leading-relaxed">
            {t.subtitleOnboarding}
          </p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-md p-6 md:p-8 space-y-6">
        
        {/* Row 1: Age & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="age" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                {t.ageLabel} <span className="text-error">*</span>
              </label>
              <button 
                type="button" 
                className="text-xs text-outline hover:text-primary transition-colors flex items-center gap-1"
                onClick={() => setActiveTooltip(activeTooltip === 'age' ? null : 'age')}
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            {activeTooltip === 'age' && (
              <div className="p-2.5 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary font-medium animate-fadeIn">
                {t.ageTooltip}
              </div>
            )}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <Calendar className="w-5 h-5" />
              </span>
              <input
                id="age"
                name="age"
                type="number"
                min="1"
                max="100"
                required
                value={profile.age}
                onChange={handleChange}
                placeholder={t.agePlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label htmlFor="gender" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              {t.genderLabel} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <User className="w-5 h-5" />
              </span>
              <select
                id="gender"
                name="gender"
                required
                value={profile.gender}
                onChange={handleChange}
                className="w-full pl-11 pr-8 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all cursor-pointer"
              >
                <option value="">{t.selectGender}</option>
                <option value="male">{t.male}</option>
                <option value="female">{t.female}</option>
                <option value="other">{t.other}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: State & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* State */}
          <div className="flex flex-col gap-2">
            <label htmlFor="state" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              {t.stateLabel} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <MapPin className="w-5 h-5" />
              </span>
              <select
                id="state"
                name="state"
                required
                value={profile.state}
                onChange={handleChange}
                className="w-full pl-11 pr-8 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all cursor-pointer"
              >
                <option value="">{t.selectState}</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi / NCR</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Other">Other State / UT</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              {t.categoryLabel} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <Info className="w-5 h-5" />
              </span>
              <select
                id="category"
                name="category"
                required
                value={profile.category}
                onChange={handleChange}
                className="w-full pl-11 pr-8 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all cursor-pointer"
              >
                <option value="">{t.selectCategory}</option>
                <option value="general">{t.general}</option>
                <option value="obc">{t.obc}</option>
                <option value="sc">{t.sc}</option>
                <option value="st">{t.st}</option>
                <option value="ews">{t.ews}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 3: Occupation & Annual Income */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Occupation */}
          <div className="flex flex-col gap-2">
            <label htmlFor="occupation" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              {t.occupationLabel} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <Briefcase className="w-5 h-5" />
              </span>
              <select
                id="occupation"
                name="occupation"
                required
                value={profile.occupation}
                onChange={handleChange}
                className="w-full pl-11 pr-8 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all cursor-pointer"
              >
                <option value="">{t.selectOccupation}</option>
                <option value="student">{t.student}</option>
                <option value="farmer">{t.farmer}</option>
                <option value="unemployed">{t.unemployed}</option>
                <option value="selfEmployed">{t.selfEmployed}</option>
                <option value="salaried">{t.salaried}</option>
              </select>
            </div>
          </div>

          {/* Income */}
          <div className="flex flex-col gap-2">
            <label htmlFor="income" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              {t.incomeLabel} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <IndianRupee className="w-5 h-5" />
              </span>
              <input
                id="income"
                name="income"
                type="number"
                min="0"
                step="10000"
                required
                value={profile.income}
                onChange={handleChange}
                placeholder={t.incomePlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all"
              />
            </div>
          </div>
        </div>

        {/* Row 4: Education & Disability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="flex flex-col gap-2">
            <label htmlFor="education" className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              {t.educationLabel} <span className="text-error">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-outline">
                <GraduationCap className="w-5 h-5" />
              </span>
              <select
                id="education"
                name="education"
                required
                value={profile.education}
                onChange={handleChange}
                className="w-full pl-11 pr-8 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all cursor-pointer"
              >
                <option value="">{t.selectEducation}</option>
                <option value="below10th">{t.below10th}</option>
                <option value="class10">{t.class10}</option>
                <option value="class12">{t.class12}</option>
                <option value="graduate">{t.graduate}</option>
                <option value="postGraduate">{t.postGraduate}</option>
              </select>
            </div>
          </div>

          {/* Disability */}
          <div className="flex flex-col gap-2">
            <label htmlFor="disability" className="text-sm font-semibold text-on-surface">
              {t.disabilityLabel}
            </label>
            <select
              id="disability"
              name="disability"
              value={profile.disability}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-medium text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary-container transition-all cursor-pointer"
            >
              <option value="no">{t.no}</option>
              <option value="yes">{t.yes}</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-primary hover:bg-primary-container text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{t.findSchemes}</span>
            <Sparkles className="w-5 h-5 text-saffron group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
