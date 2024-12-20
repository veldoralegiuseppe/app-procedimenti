import ProcedimentoMetadataV1 from "./v1.0/ProcedimentoMetadataV1";
import {ProcedimentoEnumsV1} from "@shared/metadata";

const ProcedimentoMetadata = {
    '1.0': {metadata: ProcedimentoMetadataV1, enums: ProcedimentoEnumsV1}
};

export default ProcedimentoMetadata;