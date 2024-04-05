#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

use alloc::{string::String, vec::Vec};
use stylus_sdk::{alloy_primitives::Address, msg, prelude::*};

sol_storage! {
    #[entrypoint]
    pub struct Contract {
        mapping(Address => string) did_mapping;
        mapping(string => Authors) projects_authors_mapping;
        mapping(string => string) project_doc_mapping;
    }

    pub struct Authors {
        string owner;
        string[] editors;
    }

}

#[external]
impl Contract {
    pub fn add_did(&mut self, did: String) -> Result<(), Vec<u8>> {
        let caller = msg::sender();
        if self.did_mapping.get(caller).is_empty() {
            let mut mapping = self.did_mapping.setter(caller);
            mapping.set_str(did);
        }
        return Ok(());
    }

    pub fn create_project(&mut self, project_id: String) -> Result<(), Vec<u8>> {
        let caller_did = self.caller_did();
        let mut v = self.projects_authors_mapping.setter(project_id);
        v.owner.set_str(caller_did);

        return Ok(());
    }

    pub fn add_editor(&mut self, project_id: String, editor_did: String) -> Result<(), Vec<u8>> {
        let caller_did = self.caller_did();
        let mut val = self.projects_authors_mapping.setter(project_id);
        if val.owner.get_string() == caller_did {
            let mut editors = val.editors.grow();
            editors.set_str(editor_did);
            Ok(())
        } else {
            Err(Vec::new())
        }
    }

    pub fn add_doc_cid(&mut self, project_id: String, doc_cid: String) -> Result<(), Vec<u8>> {
        let can_edit = self.can_edit(project_id.clone())?;

        if can_edit
            && self
                .project_doc_mapping
                .get(project_id.clone())
                .get_string()
                != doc_cid
        {
            let mut setter = self.project_doc_mapping.setter(project_id);
            setter.set_str(doc_cid);
            return Ok(());
        } else {
            return Err(Vec::new());
        }
    }

    pub fn can_edit(&self, project_id: String) -> Result<bool, Vec<u8>> {
        let val = self.projects_authors_mapping.get(project_id);

        if val.owner.get_string() == self.caller_did() {
            return Ok(true);
        }

        for index in 0..val.editors.len() {
            let did = val.editors.get(index);
            if did.is_some() && did.unwrap().get_string() == self.caller_did() {
                return Ok(true);
            }
        }
        return Ok(false);
    }

    pub fn get_authors(&self, project_id: String) -> Result<Vec<String>, Vec<u8>> {
        let val = self.projects_authors_mapping.get(project_id);
        let mut list: Vec<String> = Vec::new();

        for index in 0..val.editors.len() {
            if let Some(address) = val.editors.get(index) {
                list.push(address.get_string());
            }
        }
        return Ok(list);
    }

    pub fn get_doc_cid(&self, project_id: String) -> Result<String, Vec<u8>> {
        let id = self.project_doc_mapping.get(project_id);
        return Ok(id.get_string());
    }
}

impl Contract {
    fn caller_did(&self) -> String {
        return self.did_mapping.get(msg::sender()).get_string();
    }
}
