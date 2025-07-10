import { createCodamaConfig } from "gill";
 
export default createCodamaConfig({
  idl: "target/idl/vault.json",
  clientJs: "clients/js/src/generated",
});