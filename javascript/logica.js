import {Anuncio_Auto} from "./clasesAuto.js";

// cuando la página recién carga
window.onload = function(){
    //eventos
    const btnGuardar = document.getElementById("btnGuardar");
    btnGuardar.addEventListener("click", EventGuardarSobreJSON_SERVER);
    btnGuardar.addEventListener("click", TraerListadoDBJSON);

    document.getElementById("btnEliminar").addEventListener("click", EventEliminarSobreJSON_SERVER);
    document.getElementById("btnCancelar").addEventListener("click", LimpiarForm);
    document.addEventListener("click", EventClickFilas);
    //inicio
    setTimeout(()=>document.getElementById("spinner").src = "../resources/spinner.gif",500);
    setTimeout(function(){
        TraerListadoDBJSON(true,false);
    },3000);
    document.getElementById("txtTitulo").focus();

};

//-------------------------------------------------------------------------------------------------

//eventos------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function EventGuardarSobreJSON_SERVER()
{
    if(AdministrarValidaciones())
        document.getElementById("formulario").preventDefault();
        else
        {
            let id = document.getElementById("txtId").value;
            if(id == "" || id == null)
            {
                AltaAutoAsync(id);
                TraerListadoDBJSON(true,false);

            }
            else
            {
                ModificacionAutoAsync(id);
                TraerListadoDBJSON(true,false);
            }
            LimpiarForm();
        }
}

function EventEliminarSobreJSON_SERVER()
{
    EliminarDBJSON(document.getElementById("txtId").value);
    console.log("JSON eliminado");
    TraerListadoDBJSON(true,false);
    LimpiarForm();
}

function EventClickFilas(e)
{
    if(!e.target.matches("td")) return; 
    TraerListadoDBJSON(false,true,e.target.parentNode.firstChild.textContent);
    document.getElementById("btnEliminar").style.display = "inline-block";
    document.getElementById("btnCancelar").style.display = "inline-block";
    console.log("Se ha hecho click y se ha rellenado el formulario con los datos");
}


// funciones ---------------------------------------------------------------------------------------------------------------------------------------

function Crear_InsertarTablaDinamica(listado, DOMInsert)
{
    const tabla = document.createElement("table");
    tabla.setAttribute("id","tablaListado");
    //seccion thead
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    for(const key in listado[0])
    {
        const th = document.createElement("th");
        th.textContent = key;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    tabla.appendChild(thead);
    //seccion tbody
    const tbody = document.createElement("tbody");
    
    listado.forEach(element => {
        const trBody = document.createElement("tr");
        for(const key in element)
        {
            const td = document.createElement("td");
            td.textContent = element[key];
            trBody.appendChild(td);
        }
        tbody.appendChild(trBody);
        tabla.appendChild(tbody);
    });
    document.getElementById(DOMInsert).appendChild(tabla);
}

function TraerListadoDBJSON(refresco = true, llenado = false, idDeLlenado = null)
{
    let data = [];

    const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            document.getElementById("spinner").src = "../resources/spinner.gif";  
          if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 299) {
                data = JSON.parse(xhr.responseText);
                if(refresco == true && llenado == false)
                {
                    if(data.length != 0)
                    {
                        document.getElementById("divTabla").innerHTML = "";
                        Crear_InsertarTablaDinamica(data, "divTabla");
                        document.getElementById("spinner").src = "";
                        
                    }
                    else
                    {
                        document.getElementById("spinner").src = "";
                        document.getElementById("divTabla").innerHTML = "No hay elementos guardados";
                    }
                }
                else if(refresco == false && llenado == true && idDeLlenado != null)
                {
                    data.forEach(element => {
                        if(element.id == idDeLlenado)
                        {
                            document.getElementById("txtId").value = element.id;
                            document.getElementById("txtId").style.display = "inline";
                            document.getElementById("txtTitulo").value = element.titulo;
                            document.querySelector('input[name="cboVenta"]:checked').value = element.transaccion;
                            document.getElementById("txtDescripcion").value = element.descripcion;
                            document.getElementById("txtPrecio").value = element.precio;
                            document.getElementById("txtPuertas").value = element.num_puertas;
                            document.getElementById("txtKm").value = element.num_KMs;
                            document.getElementById("txtPotencia").value = element.potencia;
                        }
                    });
                }
              console.log(data);
            } else {
              const statusText = xhr.statusText || "Ocurrio un error";

              console.error(`Error: ${xhr.status} : ${statusText}`);
            }
            document.getElementById("spinner").src = "";
          }
        };
        xhr.open("GET", "http://localhost:5000/Autos"); 
        xhr.send();
}
const AltaAutoAsync = async (identificador) => {
    document.getElementById("spinner").src = "../resources/spinner.gif";

    let data = [];

    let id = identificador;
    let titulo = document.getElementById("txtTitulo").value;
    let transaccion = document.querySelector('input[name="cboVenta"]:checked').value
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = document.getElementById("txtPrecio").value;
    let puertas = document.getElementById("txtPuertas").value;
    let km = document.getElementById("txtKm").value;
    let potencia = document.getElementById("txtPotencia").value;
    
    let Auto  = new Anuncio_Auto(id,titulo,transaccion,descripcion,precio,puertas,km,potencia);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(Auto),
    };
    try {
        const res = await fetch("http://localhost:5000/Autos", options);

        if (!res.ok) {
          throw { error: res.status, statusText: res.statusText };
        }
        data = await res.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        document.getElementById("spinner").src = "";
      }
};

const ModificacionAutoAsync = async (identificador) => {
    document.getElementById("spinner").src = "../resources/spinner.gif";

    let data = [];

    let id = identificador;
    let titulo = document.getElementById("txtTitulo").value;
    let transaccion = document.querySelector('input[name="cboVenta"]:checked').value
    let descripcion = document.getElementById("txtDescripcion").value;
    let precio = document.getElementById("txtPrecio").value;
    let puertas = document.getElementById("txtPuertas").value;
    let km = document.getElementById("txtKm").value;
    let potencia = document.getElementById("txtPotencia").value;
    
    let Auto  = new Anuncio_Auto(id,titulo,transaccion,descripcion,precio,puertas,km,potencia);

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(Auto),
    };
    try {
        const res = await fetch(`http://localhost:5000/Autos/${id}`, options);

        if (!res.ok) {
          throw { error: res.status, statusText: res.statusText };
        }
        data = await res.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        document.getElementById("spinner").src = "";
      }
};


function EliminarDBJSON(key)
{
    let data = [];
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        document.getElementById("spinner").src = "../resources/spinner.gif";
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 299) {
            data = JSON.parse(xhr.responseText);
            console.log(data);
          } else {
            const statusText = xhr.statusText || "Ocurrio un error";

            console.error(`Error: ${xhr.status} : ${statusText}`);
          }
          document.getElementById("spinner").src = "";
        }
      };
      xhr.open("DELETE", `http://localhost:5000/Autos/${key}`);
      xhr.send();
}

function LimpiarForm()
{
    document.getElementById("formulario").reset();
    document.getElementById("txtId").style.display = "none";

    document.getElementById("txtTitulo").removeAttribute("readonly");
    document.getElementById("btnCancelar").style.display = "none";
    document.getElementById("btnEliminar").style.display = "none";

}

//---------------------------------------------------------------------------------------------------
//validaciones de formulario
function ValidarCamposVacios(id) {
    var retorno = false;
    if (document.getElementById(id).value == "")
        retorno = true;
    return retorno;
}

function AdministrarSpanError(id, accion) {
    if (accion) {
        document.getElementById(id).style.display = "inline-block";
    }
    else {
        document.getElementById(id).style.display = "none";
    }
}

function VerificarSpans(){
    var retorno = false;
    var titulo = document.getElementById("spanTitulo").style.display;
    var descripcion = document.getElementById("spanDescripcion").style.display;
    var precio = document.getElementById("spanPrecio").style.display;
    var Puertas = document.getElementById("spanPuertas").style.display;
    var Km = document.getElementById("spanKm").style.display;
    var Potencia = document.getElementById("spanPotencia").style.display;
    if (titulo != "none" || descripcion != "none" || precio != "none" || Puertas != "none" || Km != "none" || Potencia != "none") {
        retorno = true;
    }
    return retorno;
}

function AdministrarValidaciones() {
    if (ValidarCamposVacios("txtTitulo"))
        AdministrarSpanError("spanTitulo", true);
    else
        AdministrarSpanError("spanTitulo", false);
    if (ValidarCamposVacios("txtDescripcion"))
        AdministrarSpanError("spanDescripcion", true);
    else
        AdministrarSpanError("spanDescripcion", false);
    if (ValidarCamposVacios("txtPrecio"))
        AdministrarSpanError("spanPrecio", true);
    else
        AdministrarSpanError("spanPrecio", false);
    if (ValidarCamposVacios("txtPuertas"))
        AdministrarSpanError("spanPuertas", true);
    else
        AdministrarSpanError("spanPuertas", false);
    if (ValidarCamposVacios("txtKm"))
        AdministrarSpanError("spanKm", true);
    else
        AdministrarSpanError("spanKm", false);
    if (ValidarCamposVacios("txtPotencia"))
        AdministrarSpanError("spanPotencia", true);
    else
        AdministrarSpanError("spanPotencia", false);
    if (VerificarSpans())
        return true;
    else
        return false;
}
//----------------------------------------------------------------------------------------------------