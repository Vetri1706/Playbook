'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePlaybook } from '@/context/PlaybookContext';
import { generatePDF, printPage } from '@/utils/pdfGenerator';

export default function PrintPage() {
  const { user, step1, step2, step3, step4, step5 } = usePlaybook();

  const handleDownloadPDF = () => {
    generatePDF('playbook-content', `${user.name || 'my'}-design-thinking-playbook.pdf`);
  };

  const handlePrint = () => {
    printPage();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print Controls - Hidden when printing */}
      <div className="no-print bg-gradient-to-r from-sns-orange to-hero-spidey text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-xl md:text-2xl font-bold">Print Preview</h1>
          <div className="flex gap-3">
            <Link
              href="/step5"
              className="px-4 py-2 bg-white text-sns-orange rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Back to Edit
            </Link>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-sns-green text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-5 py-2 bg-hero-cap-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Printable Content - A4 Styled Pages */}
      <div id="playbook-content" className="max-w-4xl mx-auto py-8 space-y-8">
        
        {/* Cover Page */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden print-page" style={{ aspectRatio: '210 / 297' }}>
          <div className="h-full flex flex-col items-center justify-center p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sns-orange via-sns-green to-sns-orange" />
            
            {/* Logos */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="w-28 h-14 relative">
                <Image src="/images/snslogo.png" alt="SNS" fill className="object-contain" />
              </div>
              <div className="w-32 h-14 relative">
                <Image src="/images/snsacademylogo.png" alt="SNS Academy" fill className="object-contain" />
              </div>
            </div>

            {/* Main character */}
            <div className="w-40 h-40 relative mb-4">
              <Image src="/images/spidermansmall.png" alt="Spider-Man" fill className="object-contain" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-sns-orange mb-2">Design Thinking</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-sns-green mb-4">Playbook</h2>
            
            <div className="bg-sns-light-orange px-6 py-3 rounded-full mb-4">
              <p className="text-xl font-semibold text-sns-dark">
                {user.name ? `Created by: ${user.name}` : 'Student Work Portfolio'}
              </p>
              {user.age && <p className="text-lg text-gray-600">Age: {user.age}</p>}
            </div>

            {/* Character row */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="w-12 h-12 relative"><Image src="/images/dora.png" alt="Dora" fill className="object-contain" /></div>
              <div className="w-12 h-12 relative"><Image src="/images/peppapig.png" alt="Peppa" fill className="object-contain" /></div>
              <div className="w-12 h-12 relative"><Image src="/images/chottabheem.png" alt="Bheem" fill className="object-contain" /></div>
              <div className="w-12 h-12 relative"><Image src="/images/olaf.png" alt="Olaf" fill className="object-contain" /></div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-sns-green via-sns-orange to-sns-green" />
          </div>
        </div>

        {/* Step 1 Page */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden print-page page-break">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 relative">
                <Image src="/images/supergirl.png" alt="Supergirl" fill className="object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-hero-kim-orange">Step 1: Empathize & Define</h2>
                <p className="text-hero-kim-green font-semibold">The Detective</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-hero-kim-orange/10 p-4 rounded-xl border-l-4 border-hero-kim-orange">
                <h3 className="font-bold text-lg mb-2 text-hero-kim-orange">Problem Statement:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{step1.problem || 'No problem defined yet'}</p>
              </div>

              <div className="bg-sns-green/10 p-4 rounded-xl border-l-4 border-sns-green">
                <h3 className="font-bold text-lg mb-2 text-sns-green">Feelings:</h3>
                {step1.feelings.mode === 'draw' && step1.feelings.content ? (
                  <img src={step1.feelings.content} alt="Feelings drawing" className="max-w-full h-48 object-contain border rounded" />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{step1.feelings.content || 'No feelings described yet'}</p>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <div className="w-10 h-10 relative"><Image src="/images/joy.png" alt="Joy" fill className="object-contain" /></div>
              <div className="w-10 h-10 relative"><Image src="/images/fearfrominsideout.png" alt="Fear" fill className="object-contain" /></div>
              <div className="w-10 h-10 relative"><Image src="/images/insideout anger.png" alt="Anger" fill className="object-contain" /></div>
            </div>
          </div>
        </div>

        {/* Step 2 Page */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden print-page page-break">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 relative">
                  <Image src="/images/Thanos.png" alt="Thanos" fill className="object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-hero-thanos">Step 2: Define</h2>
                  <p className="text-hero-peppa font-semibold">The Problem Story</p>
                </div>
              </div>
              <div className="w-14 h-14 relative">
                <Image src="/images/peppapig.png" alt="Peppa Pig" fill className="object-contain" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-hero-thanos/10 p-4 rounded-xl border-l-4 border-hero-thanos">
                <h3 className="font-bold mb-2 text-hero-thanos">Who is facing the problem?</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{step2.who || 'Not answered'}</p>
              </div>
              <div className="bg-hero-peppa/20 p-4 rounded-xl border-l-4 border-hero-peppa">
                <h3 className="font-bold mb-2 text-hero-peppa">What is happening?</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{step2.what || 'Not answered'}</p>
              </div>
              <div className="bg-hero-startup/20 p-4 rounded-xl border-l-4 border-hero-startup">
                <h3 className="font-bold mb-2 text-yellow-700">When/Where does it happen?</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{step2.when || 'Not answered'}</p>
              </div>
              <div className="bg-sns-orange/10 p-4 rounded-xl border-l-4 border-sns-orange">
                <h3 className="font-bold mb-2 text-sns-orange">Why is it a problem?</h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{step2.why || 'Not answered'}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <div className="w-10 h-10 relative"><Image src="/images/chottabheem.png" alt="Bheem" fill className="object-contain" /></div>
              <div className="w-10 h-10 relative"><Image src="/images/chutki.png" alt="Chutki" fill className="object-contain" /></div>
              <div className="w-10 h-10 relative"><Image src="/images/khalia.png" alt="Khalia" fill className="object-contain" /></div>
            </div>
          </div>
        </div>

        {/* Step 3 Page */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden print-page page-break">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 relative">
                  <Image src="/images/blackpantherlogo.png" alt="Black Panther" fill className="object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-hero-panther">Step 3: Ideate</h2>
                  <p className="text-hero-panther-purple font-semibold">Crazy 6 - Wild Ideas</p>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-16 h-16 relative"><Image src="/images/tom.png" alt="Tom" fill className="object-contain" /></div>
                <div className="w-16 h-16 relative"><Image src="/images/jerry.png" alt="Jerry" fill className="object-contain" /></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {step3.ideas.map((idea) => {
                const colors = ['border-hero-panther-purple', 'border-hero-jerry', 'border-sns-orange', 'border-hero-hulk', 'border-hero-startup', 'border-hero-spidey'];
                return (
                  <div key={idea.id} className={`border-2 ${colors[idea.id - 1]} rounded-lg p-3 bg-white`}>
                    <h4 className="font-bold text-sm mb-2 text-center">Idea {idea.id}</h4>
                    {idea.mode === 'draw' && idea.content ? (
                      <img src={idea.content} alt={`Idea ${idea.id}`} className="w-full h-24 object-contain border rounded" />
                    ) : (
                      <p className="text-gray-700 text-xs min-h-[60px]">{idea.content || 'No idea yet'}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 4 Page */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden print-page page-break">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-2">
                <div className="w-16 h-16 relative"><Image src="/images/olaf.png" alt="Olaf" fill className="object-contain" /></div>
                <div className="w-16 h-16 relative"><Image src="/images/sven.png" alt="Sven" fill className="object-contain" /></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-hero-cap-blue">Step 4: Evaluate</h2>
                <p className="text-hero-frozen font-semibold">The Scorecard</p>
              </div>
            </div>
            
            <table className="w-full border-collapse border-2 border-gray-300 text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-sns-orange to-hero-spidey text-white">
                  <th className="p-2 border text-left">Idea</th>
                  <th className="p-2 border text-center">Score</th>
                  <th className="p-2 border text-center">Solves Problem?</th>
                </tr>
              </thead>
              <tbody>
                {step4.evaluations.map((evaluation, index) => (
                  <tr key={evaluation.ideaId} className={index % 2 === 0 ? 'bg-hero-frozen/10' : 'bg-white'}>
                    <td className="p-2 border font-semibold">Idea {evaluation.ideaId}</td>
                    <td className="p-2 border text-center font-bold text-sns-orange">{evaluation.score}/10</td>
                    <td className="p-2 border text-center">
                      {evaluation.solvesProblem === 'yes' ? 'Yes' : evaluation.solvesProblem === 'no' ? 'No' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 5 Page */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden print-page page-break">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 relative">
                <Image src="/images/Captain america.png" alt="Captain America" fill className="object-contain drop-shadow-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-hero-cap-blue">Step 5: Prototype</h2>
                <p className="text-hero-cap-red font-semibold">The Final Solution</p>
              </div>
              <div className="w-10 h-10 relative ml-auto">
                <Image src="/images/captainlogo.png" alt="Shield" fill className="object-contain" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-hero-cap-blue/10 p-4 rounded-xl border-2 border-hero-cap-blue">
                <h3 className="font-bold text-xl text-hero-cap-blue mb-1">Super IDEA Name:</h3>
                <p className="text-2xl font-bold text-sns-dark">{step5.ideaName || 'No name yet'}</p>
              </div>

              <div className="bg-hero-startup/10 p-4 rounded-xl border-2 border-hero-startup">
                <h3 className="font-bold mb-2 text-yellow-700">My Best Idea:</h3>
                {step5.bestIdea.mode === 'draw' && step5.bestIdea.content ? (
                  <img src={step5.bestIdea.content} alt="Best idea drawing" className="max-w-full h-40 object-contain border rounded" />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{step5.bestIdea.content || 'No idea described yet'}</p>
                )}
              </div>

              <div className="bg-sns-green/10 p-4 rounded-xl border-2 border-sns-green">
                <h3 className="font-bold mb-2 text-sns-green">How it solves the problem:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{step5.summary || 'No summary yet'}</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <div className="w-16 h-16 relative"><Image src="/images/wonderwomanlogo.png" alt="Wonder Woman" fill className="object-contain" /></div>
              <div className="w-16 h-16 relative"><Image src="/images/spidermanlogo.png" alt="Spider-Man" fill className="object-contain" /></div>
              <div className="w-16 h-16 relative"><Image src="/images/hulklogo.png" alt="Hulk" fill className="object-contain" /></div>
              <div className="w-16 h-16 relative"><Image src="/images/ironman logo.png" alt="Iron Man" fill className="object-contain" /></div>
            </div>
          </div>
        </div>

        {/* Companies / Partners Page */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden print-page page-break">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-sns-orange mb-2">Inspired by Industry Leaders</h2>
            <p className="text-center text-sns-green mb-6">Great companies started with great ideas!</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-full h-48 relative">
                  <Image src="/images/comapanies.jpg" alt="Companies" fill className="object-contain" />
                </div>
              </div>
              <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-full h-48 relative">
                  <Image src="/images/companies7+7.jpg" alt="Companies" fill className="object-contain" />
                </div>
              </div>
              <div className="col-span-2 flex justify-center items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-full h-32 relative">
                  <Image src="/images/comapnies2.jpg" alt="Companies" fill className="object-contain" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-8 border-t-2 border-gray-200 mt-6">
              <div className="flex justify-center gap-4 mb-3">
                <div className="w-20 h-10 relative">
                  <Image src="/images/snslogo.png" alt="SNS" fill className="object-contain" />
                </div>
                <div className="w-24 h-10 relative">
                  <Image src="/images/snsacademylogo.png" alt="SNS Academy" fill className="object-contain" />
                </div>
              </div>
              <p className="text-sm text-gray-500">SNS Design Thinking Playbook</p>
              <p className="text-xs text-gray-400">SNS Institutions - SNS Academy</p>
            </div>
          </div>
        </div>

      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-page { 
            page-break-after: always;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .page-break { page-break-before: always; }
          #playbook-content { 
            max-width: 100%; 
            padding: 0; 
            margin: 0;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
