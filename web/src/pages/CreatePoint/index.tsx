import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import { LeafletMouseEvent } from 'leaflet';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import Dropzone from '../../components/dropzone';
import api from '../../services/api';
import axios from 'axios';
import './styles.css';
import logo from '../../assets/logo.svg';

interface Item {
    id: number,
    title: string,
    image_url: string;
};

interface IBGEUFResponse{
    sigla: string;
};

interface IBGECITYResponse{
    nome: string;
};


const CreatePoint = () => {

    // Array ou Objeto: informar manualmente o tipo da variável
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPositionMap, setInitialPositionMap] = useState<[number,number]>([0,0]);
    
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPositionMap, setSelectedPositionMap] = useState<[number,number]>([0,0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    const history = useHistory();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialPositionMap([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items')
        .then(resp => {
            setItems(resp.data);
        })
    }, []);


    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(resp => {
            const ufInitials = resp.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    }, []);

    
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPositionMap([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData({...formData, [name]:value})
    }
    

    function handleSelectItem(id:number){
        const alreadySelected = selectedItems.findIndex(item => item=== id);

        if (alreadySelected >=0){
            const filteredItens = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItens);
        }else{
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPositionMap;
        const items = selectedItems;

        const data = new FormData();

            data.append('name',name);
            data.append('email',email);
            data.append('whatsapp',whatsapp);
            data.append('uf',uf);
            data.append('city',city);
            data.append('latitude', String(latitude));
            data.append('longitude',String(longitude));
            data.append('items',items.join(','));

            if(selectedFile){
                data.append('image', selectedFile);
            }
        

        await api.post('points', data);
        
        alert('Ponto de coleta cadastrado!!!')

        history.push('/');
    }

    // Carregar as cidades sempre que o estado for alterado
    useEffect(() => {
        if(selectedUf === '0'){
            return
        }
        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios/`)
        .then(resp => {
            const cityNames = resp.data.map(city => city.nome)
            setCities(cityNames);
        })
        
    }, [selectedUf]);

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta Logo"/>

                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para a home
                </Link>
            </header>
            <form action="" onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">
                            Nome da Entidade
                        </label>
                        <input 
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">
                               Email
                            </label>
                            <input 
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">
                                Whatsapp
                            </label>
                            <input 
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>
                    <Map center={initialPositionMap} zoom={15} onclick={handleMapClick}>
                    <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={selectedPositionMap} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>

                            <select 
                            name="uf" 
                            id="uf" 
                            onChange={handleSelectUf} 
                            value={selectedUf}>

                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option value={uf} key={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                            name="city" 
                            id="city" 
                            onChange={handleSelectCity}
                            value={selectedCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option value={city} key={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de Coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => 
                            (
                                <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                                    <img src={item.image_url} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            )
                        )} 
                    </ul>
                </fieldset>
                <button>
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}



export default CreatePoint;