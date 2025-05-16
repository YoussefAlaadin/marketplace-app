// "use client";

// import {
//   Label,
//   Listbox,
//   ListboxButton,
//   ListboxOption,
//   ListboxOptions,
// } from "@headlessui/react";
// import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
// import { categories } from "../../data";

// export default function SelectMenu({ selected, setSelected }) {
//   //console.log(selected);
//   return (
//     <Listbox value={selected} onChange={setSelected}>
//       <Label className="block text-sm/6 font-medium text-gray-900">
//         Category
//       </Label>
//       <div className="relative mt-2">
//         <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
//           <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
//             <span className="block truncate">{selected.name}</span>
//           </span>
//           <ChevronUpDownIcon
//             aria-hidden="true"
//             className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
//           />
//         </ListboxButton>

//         <ListboxOptions
//           transition
//           className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
//         >
//           {categories.map((category) => (
//             <ListboxOption
//               key={category.id}
//               value={category}
//               className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
//             >
//               <div className="flex items-center">
//                 <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
//                   {category.name}
//                 </span>
//               </div>

//               <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
//                 <CheckIcon aria-hidden="true" className="size-5" />
//               </span>
//             </ListboxOption>
//           ))}
//         </ListboxOptions>
//       </div>
//     </Listbox>
//   );
// }




// import { Description, Field, Label, Select } from '@headlessui/react'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
// import clsx from 'clsx'
// import { categories } from '../../data'

// export default function SelectMenu({ selected, setSelected }) {
//   return (
//     <div className="w-full max-w-md px-4">
//       <Field>
//         <div className="relative">
//           <Select onChange={setSelected} value={selected}
//             className={clsx(
//               'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
//               'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
//               // Make the text of each option black on Windows
//               '*:text-black'
//             )}
//           >
//           {categories.map((category) => (
//             <option
//               key={category.id}
//               value={category}
//               className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
//             >
//                   {category.name}

//               {/* <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
//                 <CheckIcon aria-hidden="true" className="size-5" />
//               </span> */}
//             </option>
//           ))}
            
//           </Select>
//           <ChevronDownIcon
//             className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
//             aria-hidden="true"
//           />
//         </div>
//       </Field>
//     </div>
//   )
// }

// components/SelectMenu.js
import { Listbox } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { categories } from '../../data'

export default function SelectMenu({selected, setSelected}) {

  return (
    <div className="w-full ">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          {/* الزرار اللي بيعرض الاختيار الحالي */}
          <Listbox.Button className="w-full rounded-lg border-black border-1 text-black  text-center">
            {selected.name}
            <ChevronDownIcon className="absolute bor right-3 top-3 h-4 w-4 text-white/50" />
          </Listbox.Button>

          {/* الليست اللي فيها الاختيارات */}
          <Listbox.Options className="absolute text-center z-10 mt-1 w-full rounded-md bg-white py-1 shadow-md ring-1 ring-black/10">
            {categories.map((category) => (
              <Listbox.Option
                key={category.id}
                value={category}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  } ${selected ? 'font-semibold' : ''}`
                }
              >
                {category.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {/* عرض القيمة المختارة تحت الليست للتأكيد */}
      
    </div>
  )
}

