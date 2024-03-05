import"https://unpkg.com/mailgo@0.12.2/dist/mailgo.min.js";document.addEventListener("DOMContentLoaded",function(){const l={"2024-03-05":{imsak:"05:49",iftar:"19:13"}},m=new Date().toISOString().split("T")[0];let d=l[m]||{imsak:"Belirlenmemiş",iftar:"Belirlenmemiş"};function r(e){const t=new Date,[a,i]=e.split(":").map(Number),n=new Date(t);n.setHours(a,i,0,0);let s=n.getTime()-t.getTime();return s<0&&(n.setDate(n.getDate()+1),s=n.getTime()-t.getTime()),c(s)}function c(e){const t=Math.floor(e/36e5),a=Math.floor(e%(1e3*60*60)/(1e3*60)),i=Math.floor(e%(1e3*60)/1e3);return`${t} : ${a} : ${i}`}function o(){const e=r(d.imsak),t=r(d.iftar),a=document.getElementById("remainingToImsak"),i=document.getElementById("remainingToIftar");t<e?(a.classList.add("hidden"),i.classList.remove("hidden"),i.innerHTML=`
          <div class="max-w-4xl mx-auto">
            <article class="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  İftara Kalan Süre
                </h3>
                <div class="mt-5">
                  <div class="mt-3 rounded-md bg-orange-50 p-4 dark:bg-gray-800">
                    <div class="flex items-center">
                      <div>
                        <span class="text-lg font-semibold text-orange-900 dark:text-orange-300">${t}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        `):(i.classList.add("hidden"),a.classList.remove("hidden"),a.innerHTML=`
          <div class="max-w-4xl mx-auto">
            <article class="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  İmsak'a Kalan Süre
                </h3>
                <div class="mt-5">
                  <div class="mt-3 rounded-md bg-orange-50 p-4 dark:bg-gray-800">
                    <div class="flex items-center">
                      <div>
                        <span class="text-lg font-semibold text-orange-900 dark:text-orange-300">${e}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        `)}o(),setInterval(o,1e3)});
