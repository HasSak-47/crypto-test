import { useState, Dispatch, SetStateAction, ChangeEvent } from 'react'

function encryptCaesar(key: number, data: string): string {
	console.log(typeof data)
	return data
		.split('')
		.map((char) => shiftChar(char, key))
		.join('')
}

function decryptCaesar(key: number, data: string): string {
	return encryptCaesar(-key, data)
}

function mod(n: number, m: number): number {
	return ((n % m) + m) % m
}

function shiftChar(char: string, key: number): string {
	const isUpper = char >= 'A' && char <= 'Z'
	const isLower = char >= 'a' && char <= 'z'

	if (!isUpper && !isLower) return char

	const base = (isUpper ? 'A' : 'a').charCodeAt(0)
	const charCode = char.charCodeAt(0) - base
	const shifted = mod(charCode + key, 26)

	return String.fromCharCode(base + shifted)
}

type Validator<T> = (
	e: ChangeEvent<HTMLInputElement>,
	setkey: Dispatch<SetStateAction<T>>
) => void

interface EncryptorProps<KeyT, DataT> {
	title: String
	validate_key: Validator<KeyT>
	validate_data: Validator<DataT>
	encrypt: (key: KeyT, data: DataT) => any
	default_key: KeyT
	default_data: DataT
}

function Encryptor<KeyT, DataT>({
	title,
	validate_key,
	validate_data,
	encrypt,
	default_key,
	default_data,
}: EncryptorProps<KeyT, DataT>) {
	const [key, setkey] = useState<KeyT>(default_key)
	const [data, setdata] = useState<DataT>(default_data)

	return (
		<div className='bg-5 text-1 mx-auto mt-10 max-w-xl rounded-xl p-6 shadow-md'>
			<h1> {title} </h1>
			<form className='flex flex-col gap-4'>
				<div className='flex flex-col'>
					<label className='text-1 mb-1 text-sm font-medium'>Key</label>
					<input
						className='form-input bg-4 text-1 rounded-md border border-3 p-2 focus:ring-2 focus:outline-none'
						onChange={(e) => validate_key(e, setkey)}
						defaultValue={'' + key}
					/>
				</div>

				<div className='flex flex-col'>
					<label className='text-1 mb-1 text-sm font-medium'>Data</label>
					<input
						className='form-input bg-4 text-1 rounded-md border border-3 p-2 focus:ring-2 focus:outline-none'
						onChange={(e) => validate_data(e, setdata)}
						defaultValue={'' + data}
					/>
				</div>
			</form>

			<div className='flex flex-col'>
				<label className='text-1 mb-1 text-sm font-medium'>Output</label>
				<output
					className='bg-3 text-1 cursor-pointer rounded-md border border-2 p-2'
					onClick={(e) => navigator.clipboard.writeText(e.currentTarget.value)}
				>
					{encrypt(key, data) || '\u00A0'}
				</output>
			</div>
		</div>
	)
}

function force_alpha(val: string) {
	let changed = ''
	for (const letter of val) {
		const lower = letter.toLowerCase()
		if ('a' <= lower && lower <= 'z') changed += letter
	}

	return changed
}

const forceChar: Validator<string> = (e, set) => {
	e.preventDefault()
	set(force_alpha(e.target.value))
}

const forceNumber: Validator<number> = (e, set) => {
	e.preventDefault()
	let new_val = parseInt(e.target.value)
	if (isNaN(new_val)) set(0)
	else set(new_val)
}

class PrivateRSAKey {
	d: bigint
	n: bigint

	constructor(d: bigint = BigInt(2), n: bigint = BigInt(2)) {
		this.d = d
		this.n = n
	}

	public toString(): string {
		crypto.subtle
		return ''
	}
}

class PublicRSAKey {
	public e: bigint
	public n: bigint

	constructor(e: bigint = BigInt(2), n: bigint = BigInt(2)) {
		this.e = e
		this.n = n
	}
	public toString(): string {
		return 'test'
	}
}

export default function App() {
	// todo handle RSA Encryption
	return (
		<div className='m-auto flex'>
			<Encryptor<number, string>
				title='Encripcion Cesar'
				validate_key={forceNumber}
				validate_data={forceChar}
				encrypt={encryptCaesar}
				default_key={0}
				default_data={''}
			/>

			<Encryptor<number, string>
				title='Desencripcion Cesar'
				validate_key={forceNumber}
				validate_data={forceChar}
				encrypt={decryptCaesar}
				default_key={0}
				default_data={''}
			/>
		</div>
	)
}
